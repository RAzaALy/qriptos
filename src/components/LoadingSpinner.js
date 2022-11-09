import React from 'react'
import CircularProgress from "@material-ui/core/CircularProgress";

const LoadingSpinner = ({ size, marginTop }) => {
  return (
    <React.Fragment>
      <div
        style={{
          textAlign: "center",
          marginTop: marginTop || "3em",
        }}
      >
        <CircularProgress disableShrink size={size || 60} />
      </div>
    </React.Fragment>
  );
};

export default LoadingSpinner;
