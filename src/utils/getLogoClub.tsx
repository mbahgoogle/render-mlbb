const clubLogoCodeMap: { [key: string]: string } = {
    'RRQ Hoshi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/RRQ_%28Rex_Regum_Qeon%29_Logo_%28SVG%29_-_Vector69Com.svg/1200px-RRQ_%28Rex_Regum_Qeon%29_Logo_%28SVG%29_-_Vector69Com.svg.png',
    
};

export const getLogoCode = (clubCode: string): string => {
    return clubLogoCodeMap[clubCode] || ''; // Kode negara tidak valid
};