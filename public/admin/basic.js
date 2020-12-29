const app = {
  toggle: (el, collectionName, attr, id) => {
    $.get('/admin/changeStatus', {
      collectionName,
      attr,
      id
    }, (data) => {
      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/admin/images/no.gif';
        } else {
          el.src = '/admin/images/yes.gif';
        }
      }
    })
  },
  // 弹窗删除
  confirmDelete () {
    $('.delete').click(() => {
      const flag = confirm('您确定要删除吗？')
      return flag
    })
  }
}