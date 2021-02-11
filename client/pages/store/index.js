import axios from "axios";
import { API } from "../../config";
import Title from "../../components/title";
import ProductItem from "../../components/product/product";
import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../components/context/globalstate";
import filterSearch from "../../utils/filterSearch";
import { useRouter } from "next/router";
import Filter from "../../components/filter";

const Store = (props) => {
  const [products, setProducts] = useState(props.products);
  // console.log(products);

  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;
  // console.log(auth);

  const [isChecked, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckAll = () => {
    //
    products.forEach((product) => {
      product.checked = !isChecked;
    });
    setProducts([...products]);
    setIsCheck(!isChecked);
  };

  const handleDeleteAll = () => {
    //
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          name: "Delete all selected products?",
          type: "DELETE_PRODUCT",
        });
      }
    });
    dispatch({
      type: "ADD_MODAL",
      payload: deleteArr,
    });
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };
  return (
    <div className="products_page">
      <Head>
        <title>Store</title>
      </Head>

      <Filter state={state} />

      {auth.user && auth.user.role === "admin" && (
        <div
          className="delete_all btn btn-danger mt-2"
          style={{ marginBottom: "-10px" }}
        >
          <input
            type="checkbox"
            checked={isChecked}
            style={{
              width: "20px",
              height: "20px",
              transform: "translateY(8px)",
            }}
            onChange={handleCheckAll}
          />
          <button
            className="btn btn-danger ml-2 text-uppercase"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            delete all
          </button>
        </div>
      )}
      {products.length ? (
        <>
          <div className="products">
            {products.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                handleCheck={handleCheck}
              />
            ))}
          </div>

          {props.result < page * 6 ? (
            ""
          ) : (
            <button
              className="btn btn-info d-block mx-auto mb-4"
              onClick={handleLoadMore}
            >
              Load more
            </button>
          )}
        </>
      ) : (
        <Title name="No" title="products"></Title>
      )}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";
  const response = await axios.get(
    `${API}/store/products?limit=${
      page * 6
    }&category=${category}&sort=${sort}&name=${search}`
  );
  // console.log(response);
  return {
    props: {
      products: response.data.products,
      result: response.data.result,
    },
  };
}

export default Store;
