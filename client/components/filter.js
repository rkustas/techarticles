import React, { useState, useEffect } from "react";
import filterSearch from "../utils/filterSearch";
import { useRouter } from "next/router";
import Title from "./title";

const Filter = ({ state }) => {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const { categories } = state;

  const router = useRouter();

  const handleCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  useEffect(async () => {
    if (search) {
      filterSearch({ router, search: search ? search.toLowerCase() : "all" });
    }
  }, [search]);

  return (
    <>
      <div className="row text-center"></div>

      <Title name="filter" title="products"></Title>
      <div className="input-group">
        <div className="input-group-prepend col-md-2 px-0 mt-2">
          <select
            className="custom-select text-capitalize"
            value={category}
            onChange={handleCategory}
          >
            <option value="all">All Products</option>

            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <form autoComplete="off" className="mt-2 col-md-8 px-0">
          <input
            type="text"
            className="form-control"
            list="name_product"
            value={search.toLowerCase()}
            onChange={(e) => setSearch(e.target.value)}
          />
          <datalist id="name_product">
            <option value="name">Product Name</option>
          </datalist>

          <button
            className="position-absolute btn btn-info"
            type="submit"
            style={{ top: 0, right: 0, visibility: "hidden" }}
          >
            Search
          </button>
        </form>
        <div className="input-group-prepend col-md-2 px-0 mt-2">
          <select
            className="custom-select text-capitalize"
            value={sort}
            onChange={handleSort}
          >
            <option value="all">All Products</option>
            <option value="-createdAt">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="-sold">Most sold</option>
            <option value="-price">Price: High-Low</option>
            <option value="price">Price: Low-High</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Filter;
