import React from 'react';
import axios from 'axios';

import APIInfo from '../Constants/API';

export const ColorContext = React.createContext();

export class ColorProvider extends React.Component {
  state = {}

  async initializeState() {
      await axios({
        method: 'get',
        url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getColors}`,
      }).then((res) => {
          let colorData = res.data.colors;
          let colors = {};
          colorData.map(item => {
              colors[item.ID.trim()] = item.COLOR;
          })
          colors = JSON.parse(JSON.stringify(colors));
          this.setState({colors: colors});
      });
  }

  componentDidMount() {
      this.initializeState();
  }

  render() {
    return (
      <ColorContext.Provider value={{state:this.state}}>
        { this.props.children }
      </ColorContext.Provider>
    )
  }
}
