import ReactDOM from 'react-dom'
import MainContainer from './pres/MainContainer'
import React from 'react'
import {trackPageView} from './app/Analytics'
import LoadingOverlay from 'react-loading-overlay'

class LoadingContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      message: 'Loading games... (0%)'
    }
  }

  render() {
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text={this.state.message}
      >
        <MainContainer updateLoadingParams={(params) => {
          this.setState({
            loading: params.loading,
            message: params.message
          })
        }} />
      </LoadingOverlay>
    )
  }
}


ReactDOM.render(<LoadingContainer />, document.getElementById('root'))
trackPageView()