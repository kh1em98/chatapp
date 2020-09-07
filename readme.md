# Simple chat application

## Đăng ký, đăng nhập
- Sử dụng bcrypt
- Cơ chế hoạt động : tạo 1 salt random. Mật khẩu lưu vào database sẽ bao gồm salt và hash(mật khẩu + salt). Có salt round để quyết định hash hết bao nhiêu thời gian. Nên hacker có dùng siêu máy tính, chỉ cần tăng salt round thì cũng không thể mò mật khẩu nhanh chóng được

## Xác thực người dùng
- ### Mục tiêu
    - Có thể kết hợp với 2 factor authentication, phân quyền người dùng ( đã xác thực email hay chưa... )
    - User duy trì đăng nhập nếu không tắt trình duyệt web 
    - User sẽ phải đăng nhập lại sau 30 phút không truy cập web 
- ### Cách thức thực hiện : sử dụng JsonWebToken kết hợp với 2 cookie
    - Khi user đăng nhập thành công, lưu 1 số thông tin như tên, avatar, đã xác thực email... vào payload. Sử dụng JWT tạo 1 chuỗi format *header.payload.signature*
    - *Header.payload* được lưu vào cookie, hết hạn sau 30 phút 
    - *Signature* được lưu vào cookie, set httpOnly, để JavaScript không thể đọc được cookie, phòng trường hợp người dùng bị XSS Attack
    - Để phòng tránh *CSRF*, mỗi khi request lên server ta sẽ gửi kèm header *X-Requested-With: XMLHttpRequest*. Header này sẽ không thể set nếu khác domain
    - Khi user request lên server, server sẽ lấy header, payload, signature trong cookie, xác thực chúng. Nếu thành công, server sẽ tạo ra 1 JWT mới, set lại thời gian hết hạn của cookie *header.payload*

## Đăng xuất
- Xóa cookie

## Thay đổi avatar 
- Sử dụng API của Imgur cho phép upload và lấy link ảnh

## Xác thực email 
- Browser sau khi xem thông tin trong cookie header and payload, sẽ biết user đã xác thực email hay chưa
- Nếu chưa xác thực, chuyển tới trang xác thực. Phía server sẽ tạo 1 chuỗi random, lưu vào database, sau 10 phút sẽ xóa. Gửi email chứa đường dẫn + chuỗi này tới email user.
- Khi user click vào đường dẫn trong email, server sẽ xác thực token đi kèm trong đường dẫn này. 

## Chat
- Sử dụng socketio







