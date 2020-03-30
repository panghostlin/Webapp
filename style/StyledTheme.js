/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Monday 30 March 2020 - 13:11:17
** @Filename:				StyledTheme.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Monday 30 March 2020 - 13:11:25
*******************************************************************************/

import	{ThemeProvider}						from	'styled-components';
import	{CustomAwesomeGrid, DefaultTheme}	from	'./References';
import	{GlobalStyle}						from	'./Global';

function	WithTheme(props) {
	return (
		<ThemeProvider theme={{awesomegrid: CustomAwesomeGrid, ...DefaultTheme}}>
			<GlobalStyle />
			{props.children}
		</ThemeProvider>
	);
}

export default WithTheme;
