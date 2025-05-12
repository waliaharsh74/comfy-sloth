import styled from "styled-components";
import { PageHero } from "../components";
import aboutImg from "../assets/hero-bcg.jpeg";

const AboutPage = () => {
  return (
    <main>
      <PageHero title="About"></PageHero>
      <Wrapper className="page section section-center">
        <img src={aboutImg} alt="Nice Desk" />
        <article>
          <div className="title">
            <h2>Our Story</h2>
            <div className="underline"></div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae
              minus, recusandae ex distinctio nihil officiis quaerat dolorum
              velit voluptates sed, cum vitae repellat porro culpa enim sint hic
              voluptatem. Quidem. Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Quas consequatur, enim neque asperiores
              accusantium ex delectus quis quia? Culpa, inventore. minus,
              recusandae ex distinctio nihil officiis quaerat dolorum velit
              voluptates sed, cum vitae repellat porro culpa enim sint hic
              voluptatem. Quidem. Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Quas consequatur, enim neque asperiores
              accusantium ex delectus quis quia? Culpa, inventore.
            </p>
          </div>
        </article>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 4rem;
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 500px;
    object-fit: cover;
  }
  p {
    line-height: 2;
    max-width: 45em;
    margin: 0 auto;
    margin-top: 2rem;
    color: var(--clr-grey-5);
  }
  .title {
    text-align: left;
  }
  .underline {
    margin-left: 0;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;
export default AboutPage;
