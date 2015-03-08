(function($) {

	var gravity_update_delay = 10; // ms pr update
	var scale_update_delay = 50; // ms pr update
	var bar_rotation = 1; // deg pr sec
	var scale_bar_length = 250;
	var rotation = 0;
	var oldDy = 0;
	var oldDx = 0;
	var plateHeight = 0;
	
	var methods = {
		init: function(options) {
			var defaults = {
				n: 9
			}; //default options
			var options = $.extend(defaults, options);
			return $(this).each(function() {
				with({$this:$(this)}) {
					$this.data('options', options); // Remember the initial options.
					$this.bind('touchmove', false);
					
					// drop logic for left plate
					$this.find(".left-plate").droppable({
						drop: function( event, ui ) {
							
					          var ballN = ui.draggable.data("number");
					          
					          //checks that the ball is not on the plate
					          if($(this).data("ball"+ballN) === false || $(this).data("ball"+ballN) === undefined){					         
					        	  
					        	  //adds the ball to the plate
					        	  $(this).data("ball"+ballN,true);
					        	  $this.ball("addBall",$(this),ui.draggable);
					        	  ui.draggable.addClass("onLplate");
					        	  ui.draggable.data("onPlate",-1);
					        	  
					        	  console.log("dropped on left!! " + ballN);
					        	  $this.ball("updateWeight");
					          }
					          
					          
					     },
					     out: function( event, ui ) {
					    	 
					    	 var ballN = ui.draggable.data("number");
					    	 
					    	 //checks that the ball is on the plate before removing it
					    	 if($(this).data("ball"+ballN) === true){
					    		 
					    		 //adds the ball to the plate
					    		 $this.ball("removeBall",$(this),ui.draggable);
					    		 $(this).data("ball"+ballN,false);
					    		 ui.draggable.removeClass("onLplate");
					    		 ui.draggable.data("onPlate",0);
					    		 
					    		 console.log("left on left!! " + ui.draggable.data("number"));
					    		 $this.ball("updateWeight");
					    	 } 
					     }
					     
					});
					
					// drop logic for right plate
					$this.find(".right-plate").droppable({
					      drop: function( event, ui ) {
					    	  
					          var ballN = ui.draggable.data("number");
					          
					          //checks that the ball is not on the plate
					          if($(this).data("ball"+ballN) === false || $(this).data("ball"+ballN) === undefined){
						          
					        	  //adds the ball to the plate
					        	  $(this).data("ball"+ballN,true);
					        	  $this.find(".ball"+ballN).data
					        	  $this.ball("addBall",$(this),ui.draggable);
					        	  ui.draggable.addClass("onRplate");
					        	  ui.draggable.data("onPlate",1);
					        	  
					        	  console.log("dropped on right	!! " + ballN);
					        	  $this.ball("updateWeight");
					          }
					          
					          
					     },
					     out: function( event, ui ) {
					    	 
					    	 var ballN = ui.draggable.data("number");
					    	 
					    	 //checks that the ball is on the plate before removing it
					    	 if($(this).data("ball"+ballN) === true){
					    	 	
					    		 // Removes the ball from the plate
					    	 	 $this.ball("removeBall",$(this),ui.draggable);
					    	 	 $(this).data("ball"+ballN,false);
					    	 	 ui.draggable.removeClass("onRplate");
					    	 	 ui.draggable.data("onPlate",0);
					    	 	 
					    	 	 
					    	 	 console.log("left on right!! " + ui.draggable.data("number"));
					    	 	 $this.ball("updateWeight");	
					    	 }
					     },
					});
					
					// checks if it is the correct ball
					$this.find(".deposit").droppable({						
						drop: function( event, ui ) {

							//if the ball is the heavy ball the call gameover with good condition
							// else call gameover with bad condition
							if(ui.draggable.data("number") === $this.data("heavyBall")){
								$this.ball("gameover",$this.data("attempts"),false,true);
							} else {
								$this.ball("gameover",$this.data("attempts"),false,false);
							}
						}
					});
					
					// weighs the balls
					$this.find(".weigh").live('click tap', function() {
						$this.data("attempts",($this.data("attempts")+1));
						$this.ball("weigh");
						$this.ball("updateWeight");
					});
					
					$this.find(".reset").live('click', function() {
						$this.ball("gameover");
					});
					
					$this.ball("gameover");
					
					$this.find(".startButton").live('click', function() {
						console.log("start game");
						$this.ball("start");
					});
					
				}
			}).ball("updateWeight");
		},
				
		animateScale: function(direction) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					console.log("disable dragable balls");
					// disable drageable balls
					$( ".ball" ).draggable( "disable" );
					$(".weigh").prop('disabled', true);
					
					//if the scale is in the desired position then perform equilibrium animation
					if((rotation === -20 && direction === -1) || (rotation === 20 && direction === 1) || direction === 0 && rotation ===0){
						$this.ball("equilAnimation",0);
						
					}else{
						
						console.log("move!!");
						
						$scaleBar = $this.find(".scaleB");
						$plateL = $this.find(".scaleP-left");
						$plateR = $this.find(".scaleP-right");
						$counterL = $this.find(".left-plate");
						$counterR = $this.find(".right-plate");
						
						//calculates the initial position
						var x = Math.cos(0*Math.PI/180)*scale_bar_length;
						var y = Math.sin(0*Math.PI/180)*scale_bar_length;
						
						var interval = setInterval(function(){
							
							//updates the rotation
							if(direction === 1){
								rotation = rotation + bar_rotation;
							}else if( direction === -1){
								rotation = rotation - bar_rotation;
							}else{
								if(rotation <= 20 && rotation > 0){
									rotation = rotation - bar_rotation;
								} else if (rotation >= -20 && rotation < 0){
									rotation = rotation + bar_rotation;
								} else{
									$this.ball("equilAnimation",0);
								}
							}
							
							//calculates the offset
							var dx = x-Math.cos(rotation*0.91*Math.PI/180)*scale_bar_length;
							var dy = y-Math.sin(rotation*0.91*Math.PI/180)*scale_bar_length;
							
							//transforms the scales
							$scaleBar.css("-webkit-transform", "rotate("+rotation+"deg)");
							$plateL.css("-webkit-transform", "translate("+dx+"px,"+dy+"px)");
							$plateR.css("-webkit-transform", "translate("+-dx+"px,"+-dy+"px)");
							$counterL.css("-webkit-transform", "translate("+dx+"px,"+dy+"px)");
							$counterR.css("-webkit-transform", "translate("+-dx+"px,"+-dy+"px)");
							
							//moves the balls
							$(".onLplate").each(function() {
								
								var t = parseInt($(this).css("top"));
								$(this).css("top", (t+(Math.floor(dy)-Math.floor(oldDy))));
								var l = parseInt($(this).css("left"));
								$(this).css("left", (l+(Math.floor(dx)-Math.floor(oldDx))));

							});
							
							$(".onRplate").each(function() {
								var t = parseInt($(this).css("top"));
								$(this).css("top", (t-(Math.floor(dy)-Math.floor(oldDy)))+"px");
								var l = parseInt($(this).css("left"));
								$(this).css("left", (l-(Math.floor(dx)-Math.floor(oldDx))) + "px");

							});
							
							oldDy = dy;
							oldDx = dx;
							
							if(rotation === -20 || rotation === 20 || (direction === 0 && rotation ===0)){
								clearInterval(interval);
								$( ".ball" ).draggable( "enable" );
								$(".weigh").prop('disabled', false);
							}
							
						},scale_update_delay);
						
					}
					
				}
			});
		},
		
		equilAnimation: function(equal) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					$scaleBar = $this.find(".scaleB");
					$plateL = $this.find(".scaleP-left");
					$plateR = $this.find(".scaleP-right");
					$counterL = $this.find(".left-plate");
					$counterR = $this.find(".right-plate");
					
					//calculates the initial position
					var x = Math.cos(0*Math.PI/180)*scale_bar_length;
					var y = Math.sin(0*Math.PI/180)*scale_bar_length;
					
					var t = 0;
					
					var interval = setInterval(function(){

						//increment time
						t = t+1;
						
						//updates the rotation
						if(equal === -1)
							drotation = rotation-2*Math.sin(t/(0.5*Math.PI));
						else {
							drotation = rotation+2*Math.sin(t/(0.5*Math.PI));
						}
						console.log("rotator " + drotation);
						
						var dx = x-Math.cos(drotation*0.91*Math.PI/180)*scale_bar_length;
						var dy = y-Math.sin(drotation*0.91*Math.PI/180)*scale_bar_length;
						
						$scaleBar.css("-webkit-transform", "rotate("+drotation+"deg)");
						$plateL.css("-webkit-transform", "translate("+dx+"px,"+dy+"px)");
						$plateR.css("-webkit-transform", "translate("+-dx+"px,"+-dy+"px)");
						$counterL.css("-webkit-transform", "translate("+dx+"px,"+dy+"px)");
						$counterR.css("-webkit-transform", "translate("+-dx+"px,"+-dy+"px)");

						$(".onLplate").each(function() {
							var t = parseInt($(this).css('top'));
							$(this).css("top", t+(Math.floor(dy)-Math.floor(oldDy))+"px");
							var l = parseInt($(this).css('left'));
							$(this).css("left", l+(Math.floor(dx)-Math.floor(oldDx))+"px");
						});
						$(".onRplate").each(function() {
							var t = parseInt($(this).css('top'));
							$(this).css("top", t-(Math.floor(dy)-Math.floor(oldDy))+"px");
							var l = parseInt($(this).css('left'));
							$(this).css("left", l-(Math.floor(dx)-Math.floor(oldDx)) + "px");
						});
						
						oldDy = dy;
						oldDx = dx;
						if(equal === 0){
							if(t === 20){
								clearInterval(interval);
								$( ".ball" ).draggable( "enable" );
								$(".weigh").prop('disabled', false);
								t = 0;
							}
						} else {
							if(t === 5){
								clearInterval(interval);
								$( ".ball" ).draggable( "enable" );
								$(".weigh").prop('disabled', false);
								t = 0;
							}
						}
					},scale_update_delay);
				}
			});
		},
		
		ballGravity: function(ball) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					console.log("ball should fall");
					
					var interval = setInterval(function(){
						
						// moves the ball
						var t = parseInt(ball.css('top'));
						t = t+5;
						ball.css("top",t + "px");

						//checks if the ball is on a plate or nit
						if( ball.data("onPlate") === 0 ){
							
							//if the ball is moved under the resting position then move it to the correct position
							if(t > 0){
								ball.css("top",0+ "px");
								clearInterval(interval);
							}
						}else if (ball.data("onPlate") === -1){
							var restingPos = (plateHeight-$this.find(".balls").offset().top);
							
							//update the resting position if the scale is not leveled
							if(rotation === 20){
								restingPos = restingPos - 78;
							} else if (rotation === -20){
								restingPos = restingPos + 78;
							}
							
							//if the ball is moved under the resting position then move it to the correct position
							if(t > restingPos){
								ball.css("top",restingPos+ "px");
								clearInterval(interval);
								$this.ball("equilAnimation",ball.data("onPlate"));
							}
						} else{
							var restingPos = (plateHeight-$this.find(".balls").offset().top);

							//update the resting position if the scale is not leveled
							if(rotation === -20){
								restingPos = restingPos - 78;
							} else if (rotation === 20){
								restingPos = restingPos + 78;
							}
							
							//if the ball is moved under the resting position then move it to the correct position
							if(t > restingPos){
								ball.css("top",restingPos+ "px");
								clearInterval(interval);
								$this.ball("equilAnimation",ball.data("onPlate"));
								
							}
						}
						
					},gravity_update_delay);
					
				}
			});
		},
		
		addBall: function(plate, ball) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					//updates the weight of the plate					
					if(ball.data("number") === $this.data("heavyBall")){
						plate.data("w",(plate.data("w")+2));
				    } else {
				       	plate.data("w",(plate.data("w")+1));
				    }
				}
			});
		},
		
		removeBall: function(plate,ball) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					//updates the weight of the plate
					if(ball.data("number") === $this.data("heavyBall")){
				 		plate.data("w",(plate.data("w")-2));
			        } else {
			        	plate.data("w",(plate.data("w")-1));
			        }
					
					//removes the ball from the plate
					if(plate === $this.find(".right-plate")){
						ball.removeClass("onRplate");
					} else{
						ball.removeClass("onLplate");
					}
					
					
				}
			});
		},
		
		resetGame: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					//initializes the plates
					$leftPlate = $this.find(".left-plate");
					$rightPlate = $this.find(".right-plate");
					$leftPlate.removeData();
					$rightPlate.removeData();
					$rightPlate.data("w",0);
					$leftPlate.data("w",0);
					$this.data("attempts",0);
					rotation = 0;
					plateHeight = $this.find(".scale").offset().top+parseInt($this.find(".plate").css("height"))-29;
					oldDy = 0;
					oldDx = 0;
					
					//resets the scale visually
					$this.find(".scaleB").css("-webkit-transform", "none");
					$this.find(".scaleP-left").css("-webkit-transform", "none");
					$this.find(".scaleP-right").css("-webkit-transform", "none");
					$this.find(".left-plate").css("-webkit-transform", "none");
					$this.find(".right-plate").css("-webkit-transform", "none");
					
					//inserts the balls
					$ballContainer = $this.find(".balls");
					$ballContainer.empty();
					for(var l = 0; l < $this.data("options").n; l++) {
						$ball = $("<div class='ball ball"+ l +"'>"+"</div>");
						$ball.data("number", (l+1));
						$ball.data("onPlate", 0);
						$ball.css("top",0);
						$ball.css("left",(l*10)+"%");
						$ball.appendTo($ballContainer);
						$ball.draggable({
					        stop: function() {
					        	//when the ball is released then the ball should fall down
						    	$this.ball("ballGravity",$(this));
						    }
					    
						});						
						$ball.append("<div class='Ballart'> <object type= 'image/svg+xml' data='images/scaleBall.svg' heigth='50'> </object>"+"</div>");
					};
				};
			}).ball("updateWeight");
		},		
		
		weigh: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					// finds the weight of each plate
					var wRight = $this.find(".right-plate").data("w");
					var wLeft = $this.find(".left-plate").data("w");
					
					if(wRight > wLeft){
						console.log("Right plate is heavier");
						$this.ball("animateScale",1);
					} else if (wRight < wLeft){
						console.log("Left plate is heavier");
						$this.ball("animateScale",-1);
					} else {
						console.log("both plate a equally heavy");
						$this.ball("animateScale",0);
					}
					
					
					
				};
			});
		},
		
		updateWeight: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					//updates hid
					var $hid = $this.find(".hid");
					if($this.data("attempts") > 2) {
						$hid.addClass("bad");
					} else {
						$hid.removeClass("bad");
					}
					
					$hid.find(".hid-ball-attempts").text($this.data("attempts"));
					/*
					//updates the weights for the plates
					var plate = $this.find(".right-plate");
					plate.text(plate.data("w"));
					plate = $this.find(".left-plate");
					plate.text(plate.data("w"));					
					*/
				};
			});
		},
		
		gameover: function(attempts,del,correct) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					$this.find(".text").hide();
					$this.find(".attempts-label").text(attempts);
					
					//show normal text
					if(del === true){
						$this.find(".text.failtext1").show();
						$this.find(".ball-hint").hide();
					} else if(correct === false){
						$this.find(".text.failtext2").show();
					} else if(correct === true) {
						$this.find(".text.wintext-1").show();
					} else {
						$this.find(".text.starttext").show();
					}
					
					// show hint text
					if(correct === true & attempts > 2){
						$this.find(".ball-hint").fadeIn('slow');
					} else {
						$this.find(".ball-hint").hide();
					}
					
					if(attempts !== undefined) {
						$this.find(".attempts-label").text(attempts);
					}
					
					$this.ball("resetGame");
					$this.find(".modal-shadow").fadeIn();
					
					
				}
			});
		},
		
		start: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					$this.find(".modal-shadow").fadeOut();
					
					// defines the heavy ball and reset
					var heavyBall = Math.floor(Math.random()*($this.data("options").n))+1;
					console.log("Pst.. the heaviest ball is "+heavyBall);
					$this.data('heavyBall', heavyBall);
					$this.data('attempts', 0);
					
				}
			});
		},
	};
	
	$.fn.ball = function(method) {
		
		if(methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === "object" || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error("Method " +  method + " does not exist on jQuery.water" );
		}   
	};
	
})(jQuery);
