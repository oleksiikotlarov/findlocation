import React from "react";

const Map = ({ data }) => {
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
    data.lon + 0.5771255493164062
  }%2C${data.lat + 0.1932498876193094}%2C${data.lon - 0.5771255493164098}%2C${
    data.lat - 0.19256589721374695
  }&amp;layer=mapnik&amp;marker=${data.lon}%2C${data.lat}`;
  return (
    <div>
      <iframe width="625" height="390" src={url}></iframe>
    </div>
  );
};

export default Map;
