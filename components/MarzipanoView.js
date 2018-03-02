import Hotspot from '../components/Hotspot.js';
import fetch from 'isomorphic-unfetch';
import config from '../config.js';

class Panorama extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      scene: false
    }
  }

  startMarzipano() {
    const script = document.createElement('script');
    script.src = "./static/marzipano.js";

    script.onload = () => {

      let panoElement = this.divContainer;

      // Create viewer.
      let viewer = new Marzipano.Viewer(panoElement);

      // Create source.
      let source = Marzipano.ImageUrlSource.fromString(this.props.tilesurl);

      // Create geometry.
      let geometry = new Marzipano.CubeGeometry([{ tileSize: 2000, size: 2000}]);

      // Create view.
      let limiter = Marzipano.RectilinearView.limit.traditional(
        4096,
        100 * Math.PI / 180,
      );
      let view = new Marzipano.RectilinearView({yaw: 4 * Math.PI / 180}, limiter);

      // Create scene.
      let scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
      });

      //Create hotspots
      let hotspots = this.props.hotspots;
      

      // Display scene.
      scene.switchTo();

      this.setState({
        loaded: true,
        scene: scene
      });

      //this.setState({scene: scene});
    }

    document.body.appendChild(script);
    
  }


  componentDidMount() {
      //window.Marzipano = require('marzipano');
      this.startMarzipano();
  }

  componentDidUpdate() {
    for(let i = 0; i < this.props.hotspots.length; i++) {
      let position = this.props.hotspots[i].position;
      let hp = document.createElement('div');
      let content = document.createTextNode(this.props.hotspots[i].title);
      hp.appendChild(content);
      this.hpDiv.appendChild(hp);
      this.createHotspot(hp, position);
      console.log(hp);
    }
  }

  createHotspot(element, position) {
      let scene = this.state.scene;    
      scene.hotspotContainer().createHotspot(element, position);
    }

  handleClick() { 
    //console.log(this);
  }

  componentWillUnmount() {
    //Destroy marzipano
  }

  render() {

    return (
      <div>
        <div
          id="panorama"
          ref={container => {
            this.divContainer = container;
          }}
          onClick={this.handleClick.bind(this)}
        />
        <div key ref={hpDiv => {
          this.hpDiv = hpDiv;
        }}>
        </div>
        <style jsx>{
          `#panorama {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%
            }`
          }
        </style>
      </div>
    );
  }
}

export default Panorama;
