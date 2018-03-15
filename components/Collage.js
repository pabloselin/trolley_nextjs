import {Stage, Layer, Rect, Image} from 'react-konva';
import DraggableImage from '../components/DraggableImage.js';

class Collage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			image: null
		}
	}

	componentDidMount() {
		const testFolder = './static/collage/';

	}

	onDrag() {

	}

	genImage() {
		let stage = this.refs.collage.getStage();
		window.open(stage.toDataURL());
	}

	render() {
		return(
			<div>
			<div className="stageContainer">
			<Stage ref="collage" height="500" width="900">
			<Layer>
			{this.props.data.cortes.map((corte, id) => (
				<DraggableImage key={id} image={corte}/>
				))		
			}
			</Layer>
			</Stage>
			<div className="genImage" onClick={this.genImage.bind(this)}>Generar imagen</div>
			</div>
			<style jsx>{`
				.stageContainer {
					width:100%;
					height:100%;
					background-color:#f0f0f0;
				}
				.genImage {
					background-color: #000;
					padding:6px;
				}
				`}</style>
				</div>
				)
	}	
}

export default Collage