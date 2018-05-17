<?php /* Template Name: PrinterPage */ 

get_header();

// Include the page content template.
get_template_part( 'content-parts/content', 'hero' ); ?>
<div id="page" class="content page-builder">

	<main id="main" class="site-main">
		<?php

		if ( site_uses_breadcrumbs() ) { custom_breadcrumbs(); }
		// Start the loop.
		while ( have_posts() ) : the_post();

			// Include the page content template.
			get_template_part( 'content-parts/content', 'page' );

			// If comments are open or we have at least one comment, load up the comment template.
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}

			// End of the loop.
		endwhile;
		?>

	</main>

</div>
<div class="uw-outer-row row-1 default-background" ><div class="uw-inner-row"><div class="uw-column one-column"><div class="uw-pe uw-pe-text_block">
<html>
<head>
<style>
progress {
    /* Reset the default appearance */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
progress[value]::-webkit-progress-value {
  background-image:
	   -webkit-linear-gradient(-45deg, 
	                           transparent 33%, rgba(0, 0, 0, .1) 33%, 
	                           rgba(0,0, 0, .1) 66%, transparent 66%),
	   -webkit-linear-gradient(top, 
	                           rgba(255, 255, 255, .25), 
	                           rgba(0, 0, 0, .25)),
	   -webkit-linear-gradient(left, #09c, #f44);

    border-radius: 2px; 
    background-size: 35px 20px, 100% 100%, 100% 100%;
}
</style>


<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<script> function print_data() {
    $.post( "/printerdata.php", function( data ) {
        document.getElementById("results").innerHTML = data
    });
}
</script>
<div id="results"> </div>
  </head>
      <body onload="print_data();">
    
    </body>
</html>
</div></div></div></div>



<?php get_template_part( 'content-parts/content', 'lower' ); ?>

<?php get_footer(); ?>