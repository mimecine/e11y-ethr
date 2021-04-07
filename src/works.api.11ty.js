class Api {
    data(){
        return {
            pagination: {
                data: 'collections.works',
                size: 1,
                alias: 'work',
            },
            permalink: data => `/api/works/${data.work.fileSlug}.json`
        }
    }
    render(data){
        const {id,title,categories,w,h,location,note,file,year,year_start,year_end,image} = data.work.data;
        return JSON.stringify({id,title,categories,w,h,location,note,file,year,year_start,year_end,image}); 
    }
}
module.exports = Api