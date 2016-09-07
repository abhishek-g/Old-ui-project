/**
 * Created by mepc1299 on 7/1/15.
 */
$.fn.dataTable.pipeline = function ( opts ) {
    // Configuration options
    var conf = $.extend( {
    }, opts );

    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function ( request, drawCallback, settings ) {



        var ajax          = false;
        var requestStart  = request.start;
        var drawStart     = request.start;
        var requestLength = request.length;
        var requestEnd    = requestStart + requestLength;

        //added by iqbal for pagination
        conf.data.pagination.pageNumber=request.start/conf.data.pagination.recordsPerPage+1;


        if ( settings.clearCache ) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        }
        else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
            // outside cached data - need to make a request
            ajax = true;
        }
        else if ( JSON.stringify( request.order )   !== JSON.stringify( cacheLastRequest.order ) ||
            JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
            JSON.stringify( request.search )  !== JSON.stringify( cacheLastRequest.search )
            ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }


        // Store the request for checking next time around
        cacheLastRequest = $.extend( true, {}, request );
        /*sorting configuration*/

        if(cacheLastRequest.order[0].column==2)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    deviceSn:1
                }
            else
                conf.data.sort={
                    deviceSn:-1
                }

        /*if(cacheLastRequest.order[0].column==2)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    typeName:1
                }
            else
                conf.data.sort={
                    typeName:-1
                }*/

        if(cacheLastRequest.order[0].column==3)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    clearedStatus:1
                }
            else
                conf.data.sort={
                    clearedStatus:-1
                }
        if(cacheLastRequest.order[0].column==4)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    ts:1
                }
            else
                conf.data.sort={
                    ts:-1
                }
        if(cacheLastRequest.order[0].column==5)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    cleared_ts:1
                }
            else
                conf.data.sort={
                    cleared_ts:-1
                }
        if(cacheLastRequest.order[0].column==7)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    acknowledged:1
                }
            else
                conf.data.sort={
                    acknowledged:-1
                }
        if(cacheLastRequest.order[0].column==8)
            if(cacheLastRequest.order[0].dir=='asc')
                conf.data.sort={
                    acknowledgedBy:1
                }
            else
                conf.data.sort={
                    acknowledgedBy:-1
                }



        /*sorting configuration*/
        if ( ajax ) {
            // Need data from the server
            if ( requestStart < cacheLower ) {
                requestStart = requestStart - (requestLength*(conf.pages-1));

                if ( requestStart < 0 ) {
                    requestStart = 0;
                }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength*conf.pages;

            // Provide the same `data` options as DataTables.
            if ( $.isFunction ( conf.data ) ) {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data( request );
                if ( d ) {
                    $.extend( request, d );
                }
            }
            else if ( $.isPlainObject( conf.data ) ) {
                // As an object, the data given extends the default
                $.extend( request, conf.data );
            }

            delete request.columns;
            console.log('req' + angular.toJson(request));
            settings.jqXHR = $.ajax( {
                "type":     conf.method,
                "url":      conf.url,
                "contentType":'application/json',
                "data":     angular.toJson(request),
                "dataType": "json",
                "cache":    false,
                "success":function ( json ) {
                    json=conf.pipelineFormatJson(json);
                    cacheLastJson = $.extend(true, {}, json);

                    if ( cacheLower != drawStart ) {
                        json.data.splice( 0, drawStart-cacheLower );
                    }
                    json.data.splice( requestLength, json.data.length );
                    drawCallback( json );
                }
            } );
        }
        else {
            json = $.extend( true, {}, cacheLastJson );
            json.draw = request.draw; // Update the echo for each response
            json.data.splice( 0, requestStart-cacheLower );
            json.data.splice( requestLength, json.data.length );

            drawCallback(json);
        }
    }
};

// Register an API method that will empty the pipelined data, forcing an Ajax
// fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTable.Api.register( 'clearPipeline()', function () {
    return this.iterator( 'table', function ( settings ) {
        settings.clearCache = true;
    } );
} );
