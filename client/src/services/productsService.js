import http from "./httpService";
//import configData from "../config.json"
import { apiUrl } from "../config";

const apiEndpoint = apiUrl + "/products";

function productUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProducts(sellerId) {
  if (sellerId)
    return http.get(apiEndpoint, {
      params: {
        seller: sellerId,
      },
    });

  return http.get(apiEndpoint);
}

export function updateProduct(productId, newProductValues) {
  return http.put(productUrl(productId), newProductValues);
}

export function addProduct(newProduct) {
  return http.post(apiEndpoint, newProduct);
}

export function deleteProduct(productId) {
  return http.delete(productUrl(productId));
}

export function updateActivateField(productId, status) {
  const payload = {
    activated: status,
  };
  return http.put(productUrl(`activate/${productId}`), payload);
}
