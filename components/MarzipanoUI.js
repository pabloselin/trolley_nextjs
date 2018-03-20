
import FontAwesomeIcon from '@fortawesome/react-fontawesome';	
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faStop from '@fortawesome/fontawesome-free-solid/faStop';

class MarzipanoUI extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const checkIcon = () => {
			if(this.props.autorotate === true) {
				return (<FontAwesomeIcon icon={faStop} />)
			} else {
				return (<FontAwesomeIcon icon={faPlay} />)
			}
		}
		return(
			<div>
			<div className={this.props.autorotate === true ? 'button active' : 'button'} onClick={this.props.rotate}>
				{checkIcon()}
			</div>
			<div className="sceneSwitcher">
				{this.props.scenes.map((scene) => (
					<div key={scene.id} className={this.props.activeScene === scene.id ? 'sceneButton active' : 'sceneButton'} onClick={ () => this.props.switcher(scene.scene, scene.id) } title={scene.title}>{scene.id}</div>
				))}
			</div>
			<style jsx>{
				`
				.button {
					position: absolute;
					bottom:0;
					left:10px;
					background-color:white;
					color:black;
					padding:6px;
					z-index:10;
					font-size:20px;
					cursor: pointer;
				}
				.button:hover {
					background-color:black;
					color:white;
				}
				.sceneSwitcher {
					position: absolute;
					left:50px;
					bottom:0;
					
				}
				.sceneButton {
					padding:6px 12px;
					font-family:'Barrio', sans-serif;
					font-size:32px;
					display:inline-block;
					background-color:white;
					text-align:center;
					color:black;
					margin-right:6px;
					cursor: pointer;
				}
				.sceneButton.active {
					background-color:#E34F35;
					color:white;
				}
				`
			}</style>
			</div>
			)
	}
}

export default MarzipanoUI