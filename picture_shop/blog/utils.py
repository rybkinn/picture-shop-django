
class PostSettings:
    """
    Post display settings.
    """
    start_posts_number = 4
    count_posts_add = 2

    min_posts_count = start_posts_number
    max_posts_count = 9999


class ValidatePostData(PostSettings):
    def validate_request(self, request) -> dict:
        """
        Validates input GET request parameters and returns the result.
        """
        result = dict()
        path_list = request.path.split('/')
        if 'show_more_posts' in path_list:
            path_list.remove('show_more_posts')
            clear_path = '/'.join(path_list)
        else:
            clear_path = path_list

        correct_pages = ('/blog/', '/blog/search/')
        if clear_path not in correct_pages:
            result.update({'success': False, 'status': 404, 'message': "Page not found"})
            return result

        if len(request.GET) == 1 and 'count_posts' in request.GET:
            try:
                count_posts = int(request.GET.get('count_posts'))
            except ValueError as error:
                result.update({'success': False, 'status': 400, 'message': error})
                return result
            else:
                if not self.min_posts_count <= count_posts < self.max_posts_count:
                    result.update({'success': False, 'status': 400, 'message': 'No valid get parameters'})
                    return result
        else:
            result.update({'success': False, 'status': 400, 'message': 'No valid get parameters'})
            return result

        result.update({'success': True, 'result': count_posts})
        return result
