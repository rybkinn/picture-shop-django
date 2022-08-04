$document.ready(function () {

	/**
	* Sidebar blog page: Remove blocks if there are no elements.
	*/
	if (typeof blog_url !== "undefined") {
		removeArchiveSidebarBlock();
		removeGallerySidebarBlock();
	}

	if (typeof blog_post_url !== "undefined") {
		removeArchiveSidebarBlock();
		removeGallerySidebarBlock();
		removeCategorySidebarBlock();
		removeLatestPostsSidebarBlock();
	}

	function removeArchiveSidebarBlock(){
		let archive_block = document.getElementById('sidebar_archive')
		let archive_elements_count = archive_block.querySelector('ul').childElementCount
		if (archive_elements_count === 0) {archive_block.remove()}
	}

	function removeGallerySidebarBlock() {
		let gallery_block = document.getElementById('sidebar_gallery')
		let gallery_elements_count = gallery_block.querySelector('ul').childElementCount
		if (gallery_elements_count === 0) {gallery_block.remove()}
	}

	function removeCategorySidebarBlock() {
		let category_block = document.getElementById('sidebar_category')
		let category_elements_count = category_block.querySelector('ul').childElementCount
		if (category_elements_count === 0) {category_block.remove()}
	}

	function removeLatestPostsSidebarBlock() {
		let latest_posts_block = document.getElementById('sidebar_latest_posts')
		let latest_posts_count = latest_posts_block.getElementsByClassName('post-recent').length
		if (latest_posts_count === 0) {latest_posts_block.remove()}
	}

});