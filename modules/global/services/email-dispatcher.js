
//var ES = require('./email-settings');
var ES = global.config.mail;
var server = ES.serverID;
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
	ssl		    : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmailForResetPassword(account)
	}, callback );
}

EM.sendActivationLink = function(account, callback)
{
    EM.server.send({
        from         : ES.sender,
        to           : account.username,
        subject      : 'Erixis',
        text         : 'Welcome to Erixis... :(',
        attachment   : EM.composeEmail(account)
    }, callback );
}

EM.composeEmail = function(o)
{
   // html:"Hi "+saveObject.fullname+ ",<br><b><a href="+server+"/loginActivation?activationId="+saveObject.activationId+">Please click the link to activate your MCloud account</a></b><br>Thanks,<br>MCloud<br>" // h
	var link = server+"/user/activation?activationId="+o.activationId;
	var html = "<html><body>";
		html += "Hi "+o.fullname+",<br><br>";
		//html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click the link to activate your Erixis account</a><br><br>";
        html += "Cheers,<br>";
        html += "Erixis<br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}


EM.composeEmailForResetPassword = function(o)
{
    var link = server+'/resetpassword?e='+o.email+'&pwdResetId='+ o.pwdResetId+"'";
    console.log("link...........",link)
    var html = "<html><body>";
    html += "Hi "+o.fullname+",<br><br>";
    html += "Your username is :: <b>"+o.fullname+"</b><br><br>";
    html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
    html += "Cheers,<br>";
    html += "Erixis<br><br>";
    html += "</body></html>";
    return  [{data:html, alternative:true}];

}




