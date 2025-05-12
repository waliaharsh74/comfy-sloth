import React, { useState } from 'react';
import styled from 'styled-components';

interface Image {
  url: string;
  filename?: string;
}

interface ProductImagesProps {
  images?: Image[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images = [{ url: '' }] }) => {
  const [main, setMain] = useState<Image>(images[0]);

  return (
    <Wrapper>
      <img src={main.url} className="main" alt="main image" />
      <div className="gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.filename ?? 'product image'}
            className={image.url === main.url ? 'active' : ''}
            onClick={() => setMain(images[index])}
          />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .main {
    height: 600px;
  }
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    object-fit: cover;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
    img {
      height: 100px;
      cursor: pointer;
    }
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
  @media (max-width: 576px) {
    .main {
      height: 300px;
    }
    .gallery {
      img {
        height: 50px;
      }
    }
  }
  @media (min-width: 992px) {
    .main {
      height: 500px;
    }
    .gallery {
      img {
        height: 75px;
      }
    }
  }
`;

export default ProductImages;