import config from "../config.js";
import HotspotWrapper from "../components/HotspotWrapper";
import MarzipanoUI from "../components/MarzipanoUI";
import MarzipanoBrand from "../components/MarzipanoBrand";
import TextWindow from "../components/TextWindow";
import HotspotTitle from "../components/HotspotTitle";
import trackPage from "../components/trackPage";

class MarzipanoView extends React.Component {
  constructor(props) {
    super(props);
    let initialfov = 2.14;
    let activefov = 1.14;
    this.state = {
      loaded: false,
      initialfov: initialfov,
      activefov: activefov,
      scene: 0,
      sceneText: null,
      scenes: [],
      curHotspots: [],
      activeKey: null,
      activeTitle: null,
      hotspotType: null,
      isRotating: false,
      autorotate: null,
      isGyroOn: false,
      viewer: null,
      view: null,
      firstRun: true,
      deviceControl: null,
      controls: null,
      utiltext: null,
      goTo: {
        yaw: 0,
        pitch: 0,
        fov: initialfov
      }
    };
    this.activateKey = this.activateKey.bind(this);
    this.deactivateKey = this.deactivateKey.bind(this);
  }

  componentDidMount() {
    this.startMarzipano();
  }

  componentDidUpdate(prevProps, prevState) {
    //Movement updates
    if (prevState.goTo !== this.state.goTo) {
      let curscene = this.findScene(this.state.scenes, this.state.scene);
      curscene.scene.lookTo(this.state.goTo);
    }
    if (prevState.isRotating !== this.state.isRotating) {
      if (this.state.isRotating === false) {
        this.state.viewer.stopMovement();
      }
      if (this.state.isRotating === true) {
        this.state.viewer.startMovement(this.state.autorotate);
      }
    }

    //Scene updates
    if (prevState.scene !== this.state.scene) {
      this.setState({
        curHotspots: this.findScene(this.state.scenes, this.state.scene)
          .hotspots
      });
    }
    if (prevState.loaded !== this.state.loaded) {
      this.setState({
        utiltext: this.props.data.utils.utiltext,
        creditstext: this.props.data.utils.creditstext
      });
    }
    if (prevState.activeKey !== this.state.activeKey) {
      if (this.state.activeKey === null) {
        this.setState({
          goTo: { fov: this.state.initialfov }
        });
      }
    }
  }

  componentWillUnmount() {
    //Destroy marzipano
  }

  startMarzipano() {
    const script = document.createElement("script");
    script.src = "./static/marzipano.js";

    script.onload = () => {
      let panoElement = this.divContainer;
      // Create viewer.
      let viewer = new Marzipano.Viewer(panoElement);

      //Start custom control
      this.startDeviceControl();

      let autorotate = Marzipano.autorotate({
        yawSpeed: 0.1, // Yaw rotation speed
        targetPitch: 0, // Pitch value to converge to
        targetFov: Math.PI / 2 // Fov value to converge to
      });

      let scenes = this.props.data.scenes.map(scene => {
        return this.createScene(scene, viewer);
      });

      this.setState({
        scenes: scenes,
        viewer: viewer,
        autorotate: autorotate
      });

      //Start with first scene
      this.switchScene(scenes[this.state.scene], 1);
      // scenes[this.state.scene].scene.switchTo();
      // this.setState({ scene: scenes[this.state.scene].id });
    };

    document.body.appendChild(script);
    this.setState({ loaded: true });
  }

  startDeviceControl() {
    const control = document.createElement("script");
    control.src = "./static/devicecontrol.js";

    control.onload = () => {
      this.setState({ deviceControl: new DeviceOrientationControlMethod() });
      let controls = this.state.viewer.controls();
      controls.registerMethod("deviceOrientation", this.state.deviceControl);
    };

    document.body.appendChild(control);
  }

  createScene(scene, viewer) {
    // Create source.
    let source = Marzipano.ImageUrlSource.fromString(scene.tilesurl);

    // Create geometry.
    let geometry = new Marzipano.CubeGeometry([{ tileSize: 2000, size: 2000 }]);

    // Create view.
    let limiter = Marzipano.RectilinearView.limit.traditional(
      4096,
      (100 * Math.PI) / 180
    );
    let view = new Marzipano.RectilinearView(
      { yaw: (4 * Math.PI) / 180, pitch: 0, fov: 2.14, roll: 0 },
      limiter
    );

    // Create scene.
    let curscene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    this.setState({ view: view });

    return {
      scene: curscene,
      view: view,
      title: scene.title,
      id: scene.id,
      hotspots: scene.hotspots,
      text: scene.text,
      active: false
    };
  }

  findScene(scenes, sceneid) {
    return scenes.find(curscene => curscene.id === sceneid);
  }

  switchScene(scene, id) {
    let sceneTo = this.findScene(this.state.scenes, id);
    sceneTo.scene.switchTo();

    if (this.state.firstRun === true) {
      this.setState({
        scene: id,
        sceneText: sceneTo.text,
        activeKey: null
      });
      this.setState({ firstRun: false });
    } else {
      this.setState({
        scene: id,
        sceneText: sceneTo.text,
        activeKey: "scenetext-" + id
      });
      trackPage(window.location.pathname, "Escena: " + id);
    }
  }

  toggleHelpWindow() {
    this.setState({
      activeKey: this.state.activeKey === "infotext" ? null : "infotext"
    });
  }

  toggleCreditsWindow() {
    this.setState({
      activeKey: this.state.activeKey === "credits" ? null : "credits"
    });
  }

  toggleRotate() {
    if (this.state.isRotating === true) {
      this.setState({
        isRotating: false
      });
    } else {
      this.setState({ isRotating: true });
    }
  }

  toggleGyro() {
    console.log("toggling gyro");
    let controls = this.state.viewer.controls();

    if (this.state.isGyroOn === true) {
      controls.disableMethod("deviceOrientation");
      this.setState({
        isGyroOn: false
      });
    } else {
      this.state.deviceControl.getPitch = (err, pitch) => {
        if (!err) {
          this.state.view.setPitch(pitch);
        }
      };

      controls.enableMethod("deviceOrientation");
      this.setState({ isGyroOn: true });
    }
  }

  getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return { x: x, y: y };
  }

  handleClick(e) {
    if (process.env.NODE_ENV !== "production") {
      let position = this.getCursorPosition(this.divContainer, e);
      let curScene = this.findScene(this.state.scenes, this.state.scene);
      let coords = curScene.view.screenToCoordinates(position);
      console.log(coords);
    }
  }

  hpState(index, position, hotspotType, event) {
    this.setPos(position, index, hotspotType);
    //this.altHp(index, hotspotType);
  }

  close(index, event) {
    this.setState({
      activeKey: null,
      hotspotType: null
    });
  }

  showMenu() {
    this.setState({
      activeKey: this.state.activeKey === "menu" ? null : "menu"
    });
  }

  altHp(index, type) {
    this.setState({
      activeKey: index,
      hotspotType: type,
      isRotating: false
    });
  }

  setPos(position, hotspotid, type) {
    this.setState({
      goTo: {
        yaw: position.yaw,
        pitch: position.pitch,
        fov: this.state.activefov
      },
      activeKey: hotspotid,
      isRotating: false,
      hotspotType: type
    });
  }

  textWindowId() {
    return `scenetext-${this.state.scene}`;
  }

  activateKey(key, position) {
    this.setState({
      activeKey: key,
      goTo: {
        yaw: position.yaw,
        pitch: position.pitch,
        fov: 0.65
      }
    });
  }

  deactivateKey() {
    this.setState({
      activeKey: null,
      goto: {
        fov: this.state.initialfov
      }
    });
  }

  renderTextWindow() {
    if (this.state.activeKey === this.textWindowId()) {
      return (
        <TextWindow
          id={this.textWindowId()}
          close={this.close.bind(this, "closeTextWindow")}
          content={this.state.sceneText}
          height={this.props.height}
        />
      );
    } else {
      return null;
    }
  }

  renderHelpWindow() {
    if (this.state.activeKey === "infotext") {
      return (
        <TextWindow
          id="infotext"
          close={this.close.bind(this, "closeInfoText")}
          content={this.state.utiltext}
          height={this.props.height}
        />
      );
    }
  }

  renderCreditsWindow() {
    if (this.state.activeKey === "credits") {
      return (
        <TextWindow
          id="credits"
          close={this.close.bind(this, "closeCredits")}
          content={this.state.creditstext}
          height={this.props.height}
        />
      );
    }
  }

  render() {
    const panoStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden"
    };

    if (this.state.loaded === true) {
      return (
        <div>
          <div
            style={panoStyle}
            id="panorama"
            ref={container => {
              this.divContainer = container;
            }}
            onClick={this.handleClick.bind(this)}
          />
          {this.state.curHotspots.map(hotspot => (
            <HotspotWrapper
              type={hotspot.type}
              active={this.state.activeKey === hotspot.id ? true : false}
              clickfunction={this.hpState.bind(
                this,
                hotspot.id,
                hotspot.position,
                hotspot.type
              )}
              close={this.close.bind(this, hotspot.id)}
              scene={this.findScene(this.state.scenes, this.state.scene)}
              key={hotspot.id}
              id={hotspot.id}
              title={hotspot.title}
              content={hotspot.content}
              data={hotspot.data}
              keyword={hotspot.keyword}
              position={hotspot.position}
              height={this.props.height}
              gyro={this.state.isGyroOn}
              activateKey={this.activateKey}
              deactivateKey={this.deactivateKey}
            />
          ))}
          {this.renderTextWindow()}
          {this.renderHelpWindow()}
          {this.renderCreditsWindow()}

          <MarzipanoBrand visible={this.state.activeKey ? false : true} />
          <MarzipanoUI
            activeKey={this.state.activeKey}
            visible={this.state.activeKey ? false : true}
            scenes={this.state.scenes}
            curHotspots={this.state.curHotspots}
            autorotate={this.state.isRotating}
            rotate={this.toggleRotate.bind(this)}
            hotspotType={this.state.hotspotType}
            activeScene={this.state.scene}
            switcher={this.switchScene.bind(this)}
            gyro={this.toggleGyro.bind(this)}
            isGyroOn={this.state.isGyroOn}
            goFull={this.props.goFull}
            showMenu={this.showMenu.bind(this)}
            isMobile={this.props.isMobile}
            toggleHelp={this.toggleHelpWindow.bind(this)}
            toggleCredits={this.toggleCreditsWindow.bind(this)}
            setPos={this.setPos.bind(this)}
            activeMenu={this.state.activeKey === "menu" ? true : false}
            hasGyro={this.props.hasGyro}
          />
        </div>
      );
    } else {
      return (
        <div>
          <div
            style={panoStyle}
            id="panorama"
            ref={container => {
              this.divContainer = container;
            }}
          />
          <div>Cargando...</div>
        </div>
      );
    }
  }
}

export default MarzipanoView;
