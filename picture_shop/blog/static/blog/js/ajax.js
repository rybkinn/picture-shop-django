$document.ready(function () {

    /**
     * AJAX script: Show more posts in blog page.
     */
    let block_posts = document.getElementById('posts');
    let post_bottom = document.getElementById('posts-bottom-button');

    if (typeof blog_url !== "undefined") {
        if (window.location.pathname === blog_url ||
            window.location.pathname === search_url ||
            window.location.pathname === archive_url ||
            is_category_page) {
            if (block_posts.childElementCount < start_posts_number) {
                post_bottom.remove()
            }
        }
    }

    $('#show_more_posts').click(function () {

        let block_posts = document.getElementById('posts');
        let get_params = (new URL(document.location)).searchParams;
        let data_params = {
            count_posts: block_posts.childElementCount
        };

        if (window.location.pathname === search_url) {
            data_params = {
                count_posts: block_posts.childElementCount,
                search_request: get_params.get("s"),
            }
        } else if (window.location.pathname === archive_url) {
            data_params = {
                count_posts: block_posts.childElementCount,
                month: get_params.get("month"),
                year: get_params.get("year")
            }
        }

        function checkPostBackgroundImage(background_image) {
            if (background_image) {
                return media_prefix + background_image;
            } else {
                return background_post_default_url;
            }
        }

        function checkAuthorAvatar(author_avatar) {
            if (author_avatar) {
                return media_prefix + author_avatar;
            } else {
                return user_avatar_default_url;
            }
        }

        $.ajax({
            type: "GET",
            url: "show_more_posts/",
            dataType: "json",
            data: data_params,
            success: function (data) {
                if (data) {
                    let _json = JSON.parse(JSON.stringify(data));
                    let posts_left = _json[0]['posts_left'];
                    let count_posts_add = _json[0]['count_posts_add'];

                    if (data.length > 1) {

                        for (let iter = 0, item = 1; iter < data.length - 1; iter++, item++) {

                            let background_image = checkPostBackgroundImage(_json[item]['background_image']);
                            let description = _json[item]['description'];
                            let creation_time = _json[item]['creation_time'];
                            let slug = post_slug_url.replace('ajax_hoOJmiSf9N', _json[item]['slug']);
                            let title = _json[item]['title'];
                            let author = _json[item]['author'];
                            let author_avatar = checkAuthorAvatar(_json[item]['author_avatar']);

                            if (posts_left <= 0) {
                                $('#show_more_posts').remove();
                            }
                            $('#posts').append(`
                                <div class="cell-sm-6 cell-flex">
                                <article class="post-grid custom-bg-image"
                                    style="background-image: url(${background_image});">
                                    <div class="post-item">
                                        <div class="post-author">
                                            <a class="author-media">
                                                <img src="${author_avatar}" alt="" width="50" ></a>
                                            <a class="author-name">${author}</a>
                                        </div>
                                    </div>
                                    <div class="post-item">
                                        <div class="content">
                                            <div class="time">
                                                <time>${creation_time}</time>
                                            </div>
                                            <h4 class="post-title">
                                                <a href="${slug}">${title}</a>
                                            </h4>
                                            <div class="post-exeption">
                                                <p>${description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>`
                            )
                        }
                    }
                    let height_block_post = document.getElementById('show_more_posts');
                    height_block_post.scrollIntoView({block: "end", behavior: "smooth"})

                    if (posts_left <= count_posts_add) {
                        document.getElementById('posts-bottom-button').remove();
                    }
                } else {
                    console.log('No data');
                }
            },
            error: function (error) {
                console.log('error => ', error);
            }
        })
    });

});