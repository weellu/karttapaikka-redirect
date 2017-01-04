function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function create_karttapaikka_url( zoom_level, etrs_coords )
{
    var url = "https://asiointi.maanmittauslaitos.fi/karttapaikka/?share=customMarker&n=" + etrs_coords[1] + "&e=" + etrs_coords[0] + 
            "&title=&desc=&zoom=" + zoom_level;
    return url;
}

function create_retkikartta_url( zoom_level, etrs_coords )
{
    var url = "http://www.retkikartta.fi/?lang=fi&layers=rajoitukset_70:taustakartta_100&x=" + etrs_coords[0] + "&y=" + etrs_coords[1] + 
            "&zoom=" + zoom_level;
    return url;
}

function create_paikkatietoikkuna_url( zoom_level, etrs_coords )
{
    var url = "http://www.paikkatietoikkuna.fi/web/fi/kartta?ver=1.17&zoomLevel=" + zoom_level + "&coord="
        + etrs_coords[0] + "_" + etrs_coords[1] + "&mapLayers=base_2+100+default&markers=2|5|0074CF|" + etrs_coords[0] + "_" + etrs_coords[1] + "|";
    return url;
}


function convert()
{
    var params = getSearchParameters();
    var zoom = false;
    var zoom_level = 10;

    // Check if zoom level is defined
    if( typeof params["zoom"] !== "undefined" )
    {
        zoom_level = params["zoom"];
    }

    // Define EPSG:3067 coordinate system
    proj4.defs('EPSG:3067', "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs");
    // Convert
    var etrs_coords = proj4('EPSG:4326', 'EPSG:3067', [params["lon"],params["lat"]]);

    var url = "";
    if( params["map"] == "rk" )
    {
        url = create_retkikartta_url(zoom_level, etrs_coords);
    }
    else if( params["map"] == "pti")
    {
        url = create_paikkatietoikkuna_url(zoom_level, etrs_coords);
    }
    else // Defaults to karttapaikka
    {
        url = create_karttapaikka_url(zoom_level, etrs_coords);
    }

    window.location = url; 
}
