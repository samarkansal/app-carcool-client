import React, { Fragment } from "react";

const Landing = () => {
  return (
    <Fragment>
      <section className="bgimg-2">
        <div className="dark-overlay">
          <div className="bgimg-inner">
            <h1 className="x-large">Driving in your car soon?</h1>
          </div>
        </div>
      </section>
      <div className="desc1">
        <h2>Let's make this your least expensive journey ever.</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
          suscipit, modi, sequi dolorum veritatis quam illum culpa optio
          incidunt quasi omnis debitis, aperiam quod nesciunt. Animi delectus
          iusto ?
        </p>
        <button className="btn">Offer a Ride</button>
      </div>
      <section className="bgimg-3">
        <div className="dark-overlay">
          <div className="bgimg-inner">
            <h1 className="x-large">Want A Ride?</h1>
          </div>
        </div>
      </section>
      <div className="desc1">
        <h3>Go literally anywhere. From anywhere.</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, fuga?
          Sequi facilis ducimus provident, impedit amet eveniet voluptas quam
          delectus eius laudantium, incidunt, accusamus pariatur quos mollitia
          ipsa modi velit.
        </p>
        <button className="btn">Find a Ride</button>
      </div>
    </Fragment>
  );
};

export default Landing;
