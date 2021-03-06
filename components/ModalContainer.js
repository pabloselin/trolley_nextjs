import trackPage from "./trackPage";

class ModalContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.ModalContainerDimensions();
		trackPage(window.location.pathname, this.props.title);
	}

	ModalContainerDimensions() {}

	render() {
		return (
			<div className="ModalWrapper">
				<div className="ModalContainer">
					{this.props.close}
					<div className="ModalContainerContent">
						{this.props.children}
					</div>
				</div>
				<style jsx>
					{`
						h2 {
							font-family: "Barrio", sans-serif;
							font-size: 32px;
							margin-top: 0;
						}
						.ModalContainer {
							width: auto;
							max-width: 600px;
							max-height: 80%;
							padding: 0;
							z-index: 2;
							transform: rotate3d(0, 0, 1, -0.5deg);
							margin: ${this.props.top}px auto 24px auto;
						}
						.ModalContainerContent {
							padding: 0;
							background-color: transparent;
						}
						@media screen and (max-width: 720px) {
							.ModalContainer {
								max-width: 90%;
								margin-top: 36px;
								transform: rotate3d(0, 0, 1, -0.5deg);
							}
						}
					`}
				</style>
			</div>
		);
	}
}

export default ModalContainer;
