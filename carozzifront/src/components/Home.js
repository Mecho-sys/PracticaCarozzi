import React from "react";
import HomeGraphs from "./HomeGraphs";

const containerStyle = {
  width: '80%', 
  margin: '0 auto' 
};

export default function Home() {
  return (
    <div  style={containerStyle} >
      <HomeGraphs />
    </div>
  );
}
