/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 18 January 2020 - 18:19:49
** @Filename:				useEffectOnce.js
**
** @Last modified by:		Tbouder
** @Last modified time:		Saturday 18 January 2020 - 18:19:52
*******************************************************************************/

import {useEffect} from 'react';

const useEffectOnce = (effect) => {
	useEffect(effect, []);
};

export default useEffectOnce;
