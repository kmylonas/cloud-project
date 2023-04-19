import _ from "lodash";

export function paginate(data, pageSize, currentPage) {
    const startIndex = pageSize * (currentPage - 1);
    return _(data).slice(startIndex).take(pageSize).value();
  }
