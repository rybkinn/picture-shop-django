$document.ready(function () {

    /**
     * Home page: Remove my work section if there are no elements.
     */
        let my_work_section = document.getElementById('my-work');

        let i = 1;
        while (i <= 3) {
          window['my_work_' + i + '_column'] = document.getElementById('my-work-' + i + '-column');
          window['my_work_' + i + '_column_count'] = window['my_work_' + i + '_column'].childElementCount;
          i++;
        }

		if (my_work_1_column_count === 0 &&
            my_work_2_column_count === 0 &&
            my_work_3_column_count === 0) {my_work_section.remove()}

});