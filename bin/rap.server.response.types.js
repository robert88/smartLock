var mine = require("./response.types.json");

exports = module.exports = (function(){
	var mineType = {};
	// 'image/x-freehand' : ['fh,fhc,fh4,fh5,fh7']
	//key --> 'image/x-freehand'
	//mine[key] --> ['fh,fhc,fh4,fh5,fh7']
	//types --> ['fh,fhc,fh4,fh5,fh7']
	for(var key in mine){

		var types = rap.toArray(mine[key]);
		var splitTypes = [];

		for(var i=0;i<types.length;i++){
			var sameTypes = types[i].split(",");
			splitTypes = splitTypes.concat(sameTypes);
		}
		//splitTypes --> ["fh","fhc","fh4","fh5","fh7"]
		for( i=0;i<splitTypes.length;i++){
			mineType[splitTypes[i]] = (mineType[splitTypes[i]]||[]);
			mineType[splitTypes[i]].push(key);
		}
	}
	rap.log("服务器支持的类型有：",mineType);
	return mineType;
}());
