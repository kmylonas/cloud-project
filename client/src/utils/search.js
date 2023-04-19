export function search(searchText, products){

    return products.filter(
        (prod) =>
          prod.name.includes(searchText) ||
          prod.seller.firstname
            .concat(" " + prod.seller.lastname)
            .includes(searchText) ||
          prod.code.includes(searchText) ||
          prod.category.includes(searchText)
      );
    


}

export function searchCart(searchText, items){

  return items.filter((item) =>
  item.product.name.includes(searchText) || 
  item.product.category.includes(searchText) ||
  item.product.code.includes(searchText) || 
  item.dateAdded.includes(searchText));
  
}



