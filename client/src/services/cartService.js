import http from "./httpService";
//import configData from "../config.json"
import { apiUrl } from "../config";

const apiEndpoint = apiUrl + "/cart";

function cartUrl(id){
    return `${apiEndpoint}/${id}`
}

export function getCart(userId){
    return http.get(cartUrl(userId));
}

export function updateCart(userId, productId, action){
    return http.put(
        cartUrl(userId),
        { product: productId },
        { params: { action: action } }
      );
}

export function clearCart(userId, action){
    return http.put(
        cartUrl(userId),
        {},
        { params: { action: action } }
      );
}