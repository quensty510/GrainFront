import request from '@/utils/request'

export default{
    getSubjectListTree(){
        return request({
            url: `/eduService/edu-subject/getAllSubject`,
            method: 'get'
        })
    }
}