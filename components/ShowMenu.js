import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faDotCircle from "@fortawesome/fontawesome-free-solid/faDotCircle";

class ShowMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const checkIcon = () => {
			if (this.props.active === true) {
				return (
					
						<FontAwesomeIcon icon={faTimes} fixedWidth />
						
					
				);
			} else {
				return (
					
						<FontAwesomeIcon icon={faDotCircle} fixedWidth />
						
					
				);
			}
		};
		return (
			<div>
				<div
					className={
						this.props.active === true
							? "button-show active noselect"
							: "button-show noselect"
					}
					onClick={this.props.onClick}
				>
					{checkIcon()}
					<span className="label">Puntos</span>
				</div>
				<style jsx>{`
					.button-show {
						position: absolute;
						bottom: 0;
						right: 0;
						background-color: white;
						color: black;
						padding: 0 6px 0 0;
						z-index: 100;
						font-size: 36px;
						box-shadow: 0 0 3px #000;
						cursor: pointer;
					}

					.button-show > span {
						font-size: 18px;
						vertical-align: middle;
						font-family: "Special Elite", sans-serif;
					}

					@media screen and (max-width: 768px) {
						.button-show {
							right: 0;
							bottom: 0;
						}
					}

					.button-show:hover {
						background-color: black;
						color: #e04f36;
					}
				`}</style>
			</div>
		);
	}
}

export default ShowMenu;
