/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Friday 03 January 2020 - 17:28:28
** @Filename:				Buttons.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 03 February 2020 - 15:52:21
*******************************************************************************/

import	styled			from	'styled-components';

const	DefaultButton = styled.button`
	font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	border-radius: 4px;
	cursor: ${props => props.disabled ? 'default' : 'pointer'};
	box-sizing: border-box;
	padding: 16px 32px;
	border: none;
	width: 100%;
	margin-top: 8px;
	&:focus {
    	outline: none;
	}
`;


const	PrimaryButton = styled(DefaultButton)`
	background-color: ${props => props.disabled ? '#9D9D9D' : '#B5B7DF'};
	color: #FFFFFF;
	&:hover {
		background-color: ${props => props.disabled ? '#9D9D9D' : '#B5B7DF80'};
		color: #FFFFFF;
	}

`;

export {PrimaryButton};
