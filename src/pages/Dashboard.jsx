import React from "react";
const Dashboard = () => {
  // Placeholder function for handling search
  const handleSearch = (searchQuery) => {
    // Implement your logic for handling the search query
    console.log("Searching for:", searchQuery);
  };
  return (
    <div className="container mt-4">
      <h2>Welcome to CarCool</h2>
      <div className="row">
        <div className="col-md-6">
          <Button
            variant="success"
            block
            onClick={() => console.log("Book a ride clicked")}
          >
            Book a ride
          </Button>
        </div>
        <div className="col-md-6">
          <Button
            variant="info"
            block
            onClick={() => console.log("Get a ride clicked")}
          >
            Get a ride
          </Button>
        </div>
      </div>
      <div className="input-group mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your destination"
        />
        <div className="input-group-append">
          <Button
            variant="primary"
            onClick={() => handleSearch("Your search query")}
          >
            Search for a ride
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
