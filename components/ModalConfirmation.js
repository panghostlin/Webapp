/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Wednesday 15 January 2020 - 10:46:09
** @Filename:				ModalConfirmation.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Tuesday 31 March 2020 - 13:23:20
*******************************************************************************/

import	React							from	'react';
import	styled							from	'styled-components';
import	{H4, P, PSmall, Blockquote}		from	'../style/Typo';
import	{Container, Row, Col}			from	'../style/Frame';
import	{Button, TextButton}			from	'../style/Button';
import	useLockBodyScroll				from	'../hooks/useLockBodyScroll';
import	GgClose							from	'../Icons/Cross';

const	ModalContainer = styled.div`
	height: ${props => props.adapt ? 'auto' : '620px'};
	width: 100%;
	max-width: 560px;
	pointer-events: auto;
	border-radius: 4px;
	box-shadow: 0 8px 16px rgba(0,0,0,.15);
	min-width: 0;
	margin: auto;
	position: relative;
	pointer-events: default;
`;
const	ModalContent = styled(Container)`
	width: auto;
	height: 100%;
	border-radius: 4px;
`;
const	Modal = styled.div`
	background-color: rgba(0,0,0,.6);
    cursor: zoom-out;
	position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 700;
	& > div {
		height: 100%;
		padding: 64px 120px 100px;
		outline: none;
		pointer-events: none;
		cursor: default;
		display: flex;
	}
`;

function	ModalConfirmation(props) {
	useLockBodyScroll()

	function	renderContent() {
		return (
			<ModalContainer adapt onClick={e => {e.preventDefault(); e.stopPropagation();}}>
				<ModalContent background={'neutral-lighter'} padding={2}>
					<Row justify={'space-between'} align={'center'}>
						<Col xs={2} sm={4} md={8} lg={8}>
							<H4 color={'white'}>{'Confirmation'}</H4>
						</Col>
						<Col xs={2} sm={4} md={2} lg={2} align={'flex-end'} style={{cursor: 'pointer'}}>
							<GgClose onClick={() => props.onClose()} />
						</Col>
					</Row>
					<Row marginTop={1}>
						<Col xs={2} sm={4} md={12} lg={12}>
							<P color={'white-80'}>{props.text}</P>
						</Col>
					</Row>
					<Row marginTop={1} paddingVertical={2} background={'neutral-darker'}>
						<Col xs={2} sm={4} md={12} lg={12}>
							<PSmall color={'white-80'}>{'How does this work ?'}</PSmall>
							<Blockquote color={'white-60'}>{'Since all your data and photos are encrypted by your secret key, we cannot modify them directly. Your browser will download each photo, make the changes, and send an encrypted version back to our servers in a secure manner. This process takes longer, but ensures the security of each of your photos.'}</Blockquote>
						</Col>
					</Row>
					<Row marginTop={1}>
						<Col xs={2} sm={4} md={12} lg={12} justify={'flex-end'} style={{flexDirection: 'row'}}>
							<TextButton
								secondary
								marginRight={0.5}
								onClick={() => props.onClose()}>
								{'Cancel'}
							</TextButton>

							<Button
								primary
								marginLeft={0.5}
								onClick={() => props.onConfirm()}>
								{'Confirm'}
							</Button>
						</Col>
					</Row>
				</ModalContent>
			</ModalContainer>
		);
	}

	if (!props.isOpen)
		return (null);
	
	return (
		<Modal onClick={() => props.onClose()}>
			<div>
				{renderContent()}
			</div>
		</Modal>
	)
}

function ModalConfirmationControler(props) {
	if (!props.isOpen)
		return (null);
	return <ModalConfirmation {...props} />
}

export default ModalConfirmationControler;
