/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Sunday 12 January 2020 - 17:06:02
** @Filename:				ToastUpload.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 10 March 2020 - 12:16:57
*******************************************************************************/

import	styled, {css, keyframes}		from	'styled-components';

const	animation = keyframes`
	0% {bottom: -120px;}
	100 {bottom: 0;}
`
const	animationRule = css`${animation} 0.6s;`

const	ToastUploadContainer = styled.div`
	position: fixed;
    overflow: visible;
    bottom: 0;
    left: 0;
    z-index: 500;
    min-width: 288px;
    max-width: 568px;
    right: auto;
	padding: 16px;
	animation: ${animationRule};
`;
const	ToastUploadCompleteElement = styled.div`
	display: inline-block;
    background-color: #FFFFFF;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,0.2), 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12);
    border-radius: 8px;
    -webkit-tap-highlight-color: transparent;
    display: block;
	overflow: hidden;
`;
const	ToastUploadElement = styled.div`
	background-color: #FFFFFF;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,0.2), 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12);
    display: flex;
    min-height: 96px;
    overflow: hidden;
    width: 328px;
	border-radius: 8px;
`;
const	ToastUploadCompleteHeader = styled.div`
	padding: 16px;
	position: relative;
	& > p {
		padding: 0;
		margin: 0;
		font-size: 14px;
		color: #3C4043;
		font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	&::after {
		content: "";
		mask: url('/static/icons/cross.svg');
		width: 24px;
		height: 24px;
		background-color: #3C4043;
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		display: block;
		position: absolute;
		right: 16px;
		top: calc(50% - 12px);
	}
`;
const	ToastUploadCompleteImage = styled.div`
    height: 180px;
    background-color: #e8eaed;
    cursor: pointer;
    width: 328px;

	& > div {
		transform: translate3d(0px, 0px, 0px);
		height: 180px;
		width: 328px;
		opacity: 1;
		position: absolute;
		background-size: cover;
		background-position: center;
	}
`;

const	ToastUploadImage = styled.img`
    object-fit: cover;
	object-position: center;
    border-radius: 3px 0 0 3px;
    height: 96px;
    width: 96px;
    min-width: 96px;
`;
const	ToastUploadMeta = styled.div`
    padding: 8px 16px;
	font-size: 14px;
	color: #3C4043;
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	position: relative;
	width: 100%;
`;
const	UploadStatus = styled.p`
	padding: 0;
	margin: 0;
	font-size: 14px;
	color: #3C4043;
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-weight: 700;
	width: 100%;
`;

const	UploadProgressBar = styled.div`
	width: 100%;
	height: 5px;
	position: absolute;
	left: 0;
	bottom: 0;
	background: #8BC34A60;
`;
const	UploadProgress = styled.div`
	background: #8BC34A;
	height: 5px;
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
`;

function	ToastUploadComplete(props) {
	return (
		<ToastUploadContainer>
			<ToastUploadCompleteElement>
				<ToastUploadCompleteHeader>
					<p>{'1 élément importé'}</p>
				</ToastUploadCompleteHeader>

				<ToastUploadCompleteImage>
					<div style={{backgroundImage: `url(https://images.unsplash.com/photo-1495973981790-4f88f563e75d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80)`}} />
				</ToastUploadCompleteImage>
			</ToastUploadCompleteElement>
		</ToastUploadContainer>
	)
}
function	ToastUploadProgress(props) {
	function	renderProgressText() {
		if (props.step === 0) {
			return (`Préparation de la photo`);
		} else if (props.step === 2) {
			return (`Chiffrement de la photo`);
		} else if (props.step === 3) {
			return (`Sauvegarde de la photo`);
		}
	}
	if (!props.open)
		return (null);
	return (
		<ToastUploadContainer>
			<ToastUploadElement>
				<ToastUploadImage
					height={96}
					width={96}
					src={props.fileAsBlobURL}
					onLoad={() => URL.revokeObjectURL(props.fileAsBlobURL)} />

				<ToastUploadMeta>
						{renderProgressText()}
					<UploadStatus>{`${props.current + 1} sur ${props.total}`}</UploadStatus>
						<UploadProgressBar>
							<UploadProgress style={{width: `${props.total > 0 ? (props.current / props.total) * 100 : 0}%`}} />
						</UploadProgressBar>
				</ToastUploadMeta>
			</ToastUploadElement>
		</ToastUploadContainer>
	)
}

function	ToastUpload(props) {
	return <ToastUploadProgress {...props} />
	
}

export default ToastUpload;
