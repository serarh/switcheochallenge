
	   var sum_to_n_a = function(n); {
		    let output = 0;
		    for (let i = 1; i <= n; i++) {
		    	output += i;
		    }
		    return output;
		};

		var sum_to_n_b = function(n); {
		    if (n <= 1) {
		    	return n;
		    } else {
		    	return n + sum_to_n_b(n-1);
		    }
		    
		};

		var sum_to_n_c = function(n); {
		    return (n*(n+1)/2);
		};
		


}
