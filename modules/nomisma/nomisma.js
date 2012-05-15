// Module: Nomisma.org API

define(['jquery'], function($) {
    return {
        name: 'Nomisma.org Entities',
        dataType: 'xml',
        // data URI is the same
        corsEnabled: true,
        parseData: function(xml) {
            var getText = awld.accessor(xml);

            var latlon = getText('[property="gml:pos"]');
            latlon = typeof latlon === 'undefined'?'':latlon.split(' ');

            var related = getText('[rel*="skos:related"]', 'href')
            related = typeof related === 'undefined'? '' : related;

            return {
                name: getText('[property="skos:prefLabel"]'),
                description: getText('[property="skos:definition"]'),
                latlon: latlon,
                related: related,
            };
        },
        getType: function(xml) {
            var map = {
                    'roman_emperor': 'person',
                    'ruler': 'person',
                    'authority': 'person',
                    'nomisma_region': 'place',
                    'hoard': 'place',
                    'mint': 'place',
                    'material': 'object',
                    'type_series_item': 'object',
                },
                type = $('[typeof]', xml).first().attr('typeof');
            if (type) return map[type];
        }
    };
});
