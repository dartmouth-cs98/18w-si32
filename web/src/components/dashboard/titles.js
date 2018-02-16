// contains some globally used titles for different main dashes/views

import React from "react";

const MainTitle = (props) => {
  return <h1 style={styles.title}>{ props.children }</h1>;
};

const SubTitle = (props) => {
  return <h2 style={styles.subTitle}>{ props.children }</h2>;
};

const styles = {
  title: {
    fontSize: 30,
  },
  subTitle: {
    fontSize: 20,
    marginTop: 20,
  }
};


export {
  MainTitle,
  SubTitle,
};
