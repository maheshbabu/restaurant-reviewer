import {
  RESTAURANTS_LOADING_INITIATION,
  RESTAURANTS_LOADING_SUCCESS,
  RESTAURANTS_LOADING_FAILURE,
  RESTAURANT_CATEGORIES,
  RESTAURANT_LOCATIONS,
  CLEAR_RESTAURANT_ERRORS,
  SET_FILTER_LOCATION,
  SET_FILTER_RATING,
  SET_FILTER_CATEGORY,
  APPLY_RESTAURANTS_FILTERS,
  CLEAR_RESTAURANTS_FILTERS,
} from './constants';
import uniq from 'lodash/uniq';
const baseUrl = 'https://restaurant-reviewer-api.herokuapp.com/api/v1/';
const restaurantUrl = `${baseUrl}restaurants`;
import fetch from 'isomorphic-fetch';

const headers = new Headers({
  'content-type': 'application/json',
});

const options = {
  method: 'GET',
  headers,
  mode: 'no-cors',
};

// loadRestaurantsInitiation :: None -> {Action}
const loadRestaurantsInitiation = () => ({
  type: RESTAURANTS_LOADING_INITIATION,
});

// loadRestaurantsSuccess :: [JSON] -> {Action}
const loadRestaurantsSuccess = (restaurants) => ({
  type: RESTAURANTS_LOADING_SUCCESS,
  restaurants,
});

// loadRestaurantCategories :: [String] -> {Action}
const loadRestaurantCategories = (categories) => ({
  type: RESTAURANT_CATEGORIES,
  categories,
});

// loadRestaurantLocations :: [String] -> {Action}
const loadRestaurantLocations = (locations) => ({
  type: RESTAURANT_LOCATIONS,
  locations,
});

// loadRestaurantsFailure :: Error -> {Action}
const loadRestaurantsFailure = (error) => ({
  type: RESTAURANTS_LOADING_FAILURE,
  error,
});

export const clearRestaurantErrors = () => ({
  type: CLEAR_RESTAURANT_ERRORS,
});

// loadRestaurants :: None -> Dispatch Func -> Action Data : Error
export const loadRestaurants = () =>
  (dispatch) => {
    dispatch(loadRestaurantsInitiation());
    fetch(restaurantUrl)
      .then(res => {
        console.log('Received a response from the server: ', res);
        return res.json();
      })
      .then(data => {
        const {
          restaurants,
        } = data;
        const staticCategories = ['All'];
        const dynamicCategories = uniq(restaurants.map(i => i.type.name));
        const finalCategories = [...staticCategories, ...dynamicCategories];
        dispatch(
          loadRestaurantCategories(finalCategories)
        );
        return restaurants;
      })
      .then(restaurants => {
        const staticLocations = ['All'];
        const dynamicLocations = uniq(restaurants.map(i => i.city));
        const finalLocations = [
          ...staticLocations,
          ...dynamicLocations,
        ];
        dispatch(
          loadRestaurantLocations(finalLocations)
        );
        return restaurants;
      })
      .then(restaurants => {
        dispatch(
          loadRestaurantsSuccess(restaurants)
        );
      })
      .catch(err => {
        const error = {
          message: `An error occurred while loading data from server: ${err}`,
        };
        dispatch(
          loadRestaurantsFailure(error)
        );
      });
  };

// setFilterLocation :: String -> {Action}
export const setFilterLocation = (location) => ({
  type: SET_FILTER_LOCATION,
  location,
});

// setFilterRating :: String -> {Action}
export const setFilterRating = (rating) => ({
  type: SET_FILTER_RATING,
  rating,
});

// setFilterCategory :: String -> {Action}
export const setFilterCategory = (category) => ({
  type: SET_FILTER_CATEGORY,
  category,
});

// applyFilter :: None -> {Action}
export const applyRestaurantsFilter = () => ({
  type: APPLY_RESTAURANTS_FILTERS,
});

// clearRestaurantsFilters :: None -> {Action}
export const clearRestaurantsFilters = () => ({
  type: CLEAR_RESTAURANTS_FILTERS,
});
