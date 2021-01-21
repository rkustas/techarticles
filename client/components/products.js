import AddToCartButton from "../components/cart/addtocartbutton";
import styled from "../node_modules/styled-components";
import Link from "next/link";

const Product = ({ product }) => {
  return (
    <ProductWrapper className="p-2">
      <div className="card h-100">
        <div className="text-center">
          <span className="mr-2">
            <Link href={`/store/${product._id}`}>
              <button className="btn btn-info text-capitalize">view</button>
            </Link>
          </span>
          <AddToCartButton key={product.id} product={product} />
          <p className="text-danger mt-2">Stock: {product.inStock}</p>
        </div>
        <div className="img-container p-5">
          <Link href={`/store/${product._id}`}>
            <a>
              <img
                src={product.Image}
                height="200px"
                width="200px"
                alt="product"
                className="card-img-top"
              />
            </a>
          </Link>
        </div>
        {/* card footer */}
        <div className="card-footer d-flex justify-content-between mb-0">
          <p className="align-self-center mb-0">{product.Name}</p>
          <h5 className="text-blue font-italic mb-0">
            <span className="mr-1">$</span>
            {product.Price}
          </h5>
        </div>
      </div>
    </ProductWrapper>
  );
};

const ProductWrapper = styled.div`
  .card {
    border-color: transparent;
    transition: all 0.4s linear;
  }
  .card-footer {
    background: transparent;
    border-top: transparent;
    transition: all 0.4s linear;
  }
  &:hover {
    .card {
      border: 0.04rem solid rgba(0, 0, 0, 0.2);
      box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.2);
    }
    .card-footer {
      background: rgba(247, 247, 247);
    }
  }
  .img-container {
    position: relative;
    overflow: hidden;
  }
  .card-img-top {
    transition: all 0.4s linear;
    cursor: pointer;
  }
  .img-container:hover .card-img-top {
    transform: scale(1.2);
  }
  .cart-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2rem 0.4rem;
    background: var(--lightBlue);
    border: none;
    color: var(--mainWhite);
    font-size: 1.5rem;
    border-radius: 0.5rem 0 0 0;
    transform: translate(100%, 100%);
  }
  .img-container:hover .cart-btn {
    transform: translate(0, 0);
    transition: all 0.4s linear;
  }
  .cart-btn:hover {
    color: var(--mainBlue);
    cursor: pointer;
  }
`;

export default Product;
