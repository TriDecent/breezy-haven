# The Breezy Haven

**[English](README.md) · [Tiếng Việt](README.vi.md)**

Ứng dụng đặt cabin và quản lý hoạt động lưu trú được xây dựng với
Next.js App Router và TypeScript.

The Breezy Haven có hai khu vực chính: giao diện dành cho khách để tìm
cabin và quản lý đặt chỗ, cùng giao diện nội bộ dành cho nhân viên để
quản lý cabin, đặt chỗ, khách hàng và hoạt động hằng ngày.

**Bản dùng thử:** <https://breezy.tridecent.me>

------------------------------------------------------------------------

## Tổng quan

Project này được xây dựng để tìm hiểu cách tổ chức một ứng dụng
full-stack sao cho các phần giao diện, xử lý nghiệp vụ và truy cập dữ
liệu không bị dồn hết vào cùng một chỗ.

Trọng tâm là phân chia trách nhiệm giữa các thành phần, xử lý
authentication và authorization, kiểm tra dữ liệu ở phía server, đồng
thời tổ chức code theo từng feature để dễ theo dõi và bảo trì.

Ứng dụng gồm hai khu vực:

- **Khu vực khách hàng** --- xem danh sách cabin, xem thông tin chi
    tiết, tạo đặt chỗ và quản lý tài khoản.
- **Khu vực nhân viên** --- quản lý cabin và đặt chỗ, xử lý
    check-in/check-out, theo dõi số liệu hoạt động và quản lý thông tin
    nhân viên.

------------------------------------------------------------------------

## Chức năng chính

### Dành cho khách hàng

- Xem các cabin
- Tìm kiếm và lọc cabin
- Xem thông tin chi tiết cabin
- Tạo đặt chỗ
- Xem lịch sử đặt chỗ
- Chỉnh sửa đặt chỗ
- Hủy đặt chỗ
- Quản lý hồ sơ cá nhân
- Đăng nhập dành cho khách
- Đăng nhập bằng Google
- Giao diện responsive
- Trạng thái loading, error và not-found

### Dành cho nhân viên

- Đăng nhập nhân viên và bảo vệ các route cần xác thực
- Dashboard hiển thị thống kê đặt chỗ và doanh thu
- Biểu đồ doanh thu và thời gian lưu trú
- Theo dõi hoạt động check-in/check-out trong ngày
- Quản lý đặt chỗ
- Tạo, cập nhật và xóa đặt chỗ
- Xử lý check-in và check-out
- Quản lý cabin
- Tạo, cập nhật, nhân bản và xóa cabin
- Tạo tài khoản nhân viên
- Quản lý hồ sơ nhân viên
- Cập nhật mật khẩu
- Quản lý cài đặt ứng dụng
- Bảng dữ liệu hỗ trợ sắp xếp và lọc
- Tải dữ liệu xuống

------------------------------------------------------------------------

## Điểm đáng chú ý về kỹ thuật

### Tổ chức project theo feature

Thay vì gom toàn bộ component, action và logic vào các thư mục chung
theo loại file, project được tổ chức xoay quanh từng feature.

Ví dụ:

``` text
features/
├── auth/
├── guest/
│   ├── account/
│   ├── cabins/
│   └── login/
└── staff/
    ├── bookings/
    ├── cabins/
    ├── dashboard/
    ├── profile/
    ├── settings/
    └── user/
```

UI, actions, schemas và logic hỗ trợ được đặt gần feature sử dụng chúng.
Những phần dùng chung nằm trong `shared/`, còn xử lý nghiệp vụ và truy
cập dữ liệu được tách vào `services/` và `repositories/`.

------------------------------------------------------------------------

### Tách riêng xử lý nghiệp vụ

Các thao tác nghiệp vụ được tách khỏi phần hiển thị UI và truy cập dữ
liệu.

``` text
UI / Server Actions
        ↓
    Services
        ↓
   Repositories
        ↓
     Supabase
```

Ví dụ, các thao tác liên quan đến đặt chỗ được xử lý bởi
`BookingService`, trong khi việc truy cập dữ liệu được thực hiện thông
qua repository.

Cách tổ chức này giúp dễ theo dõi luồng xử lý và hạn chế việc nhúng quá
nhiều business logic trực tiếp vào React components.

------------------------------------------------------------------------

### Authentication và authorization

Ứng dụng có cơ chế xác thực riêng cho khách hàng và nhân viên.

Các thành phần liên quan bao gồm:

- Xác thực bằng thông tin đăng nhập
- Đăng nhập bằng Google
- Quản lý session dựa trên JWT
- Băm mật khẩu bằng bcrypt
- Bảo vệ JWT bằng RSA
- Bảo vệ các route dành cho khách và nhân viên
- Tách biệt luồng xác thực của khách và nhân viên

Code liên quan đến authentication được đặt tại:

``` text
features/auth/
```

Các endpoint xác thực và quản lý session nằm trong:

``` text
app/api/auth/
app/api/session/
```

------------------------------------------------------------------------

### Kiểm tra dữ liệu phía server

Dữ liệu đầu vào được kiểm tra bằng các schema của Zod.

Các schema liên quan đến domain nằm trong:

``` text
shared/schemas/
```

Ví dụ:

``` text
Booking.ts
Cabin.ts
Guest.ts
Signup.ts
Staff.ts
Setting.ts
```

Việc này tạo ra một điểm kiểm tra dữ liệu nhất quán cho các thao tác như
tạo tài khoản, cập nhật hồ sơ, quản lý cabin và xử lý đặt chỗ.

------------------------------------------------------------------------

### Tách biệt khu vực khách và nhân viên

Ứng dụng xem khách hàng và nhân viên là hai nhóm có nhu cầu sử dụng khác
nhau, thay vì hiển thị cùng một giao diện cho mọi tài khoản đã đăng
nhập.

Cấu trúc route phản ánh sự phân chia này:

``` text
app/
├── guest/
└── staff/
```

Khách hàng sử dụng các chức năng liên quan đến đặt chỗ. Nhân viên có
thêm các chức năng vận hành như quản lý cabin, quản lý đặt chỗ, xem
dashboard và xử lý check-in/check-out.

------------------------------------------------------------------------

### Quản lý state

Redux Toolkit được sử dụng cho những phần state cần quản lý tập trung.

Project cũng sử dụng RTK Query để truy vấn API và cache dữ liệu.

Một số module state:

``` text
shared/store/
├── auth-api.ts
├── cabin-form-slice.ts
├── ui-slice.ts
└── store.ts
```

Với những state chỉ phục vụ một component hoặc một phạm vi nhỏ, project
vẫn sử dụng state cục bộ của React thay vì đưa tất cả vào global state.

------------------------------------------------------------------------

### UI dùng chung và hạ tầng dùng chung

Các UI primitives và component dùng chung được đặt trong:

``` text
shared/components/
```

Bao gồm các thành phần phục vụ:

- Form
- Bảng dữ liệu
- Dialog và modal
- Navigation
- Button
- Input
- Select
- Calendar
- Notification
- Loading state
- Error state
- Biểu đồ dữ liệu
- Layout

Giao diện được xây dựng với Radix UI primitives và Tailwind CSS.

------------------------------------------------------------------------

## Kiến trúc project

Cấu trúc tổng quát của source code:

``` text
src/
├── app/
│   ├── api/
│   ├── guest/
│   ├── staff/
│   └── ...
├── features/
│   ├── auth/
│   ├── guest/
│   └── staff/
├── lib/
├── repositories/
├── services/
├── shared/
│   ├── actions/
│   ├── animations/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── providers/
│   ├── schemas/
│   ├── store/
│   ├── types/
│   └── utils/
└── styles/
```

### `app/`

Chứa các route, layout, loading state, error boundary, trang not-found
và API Route Handler của Next.js App Router.

### `features/`

Chứa code dành riêng cho từng feature. Mỗi feature có thể bao gồm:

- Component
- Server action
- Schema
- Context
- UI hỗ trợ
- Logic riêng của feature

### `services/`

Chứa các thao tác ở tầng application và business logic.

Ví dụ:

``` text
BookingService
CabinService
GuestService
StaffService
SettingService
FileService
```

### `repositories/`

Chứa các abstraction phục vụ truy cập dữ liệu và phần triển khai
persistence cụ thể. Ví dụ trong project có repository cho file và
refresh token.

### `shared/`

Chứa các thành phần được dùng ở nhiều feature, bao gồm UI, schema, state
management, hook, animation, utility và provider.

------------------------------------------------------------------------

## Công nghệ sử dụng

### Nền tảng

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Frontend

- React
- Redux Toolkit
- RTK Query
- Framer Motion
- Radix UI
- React Hook Form
- Zod
- Sonner

### Backend và dữ liệu

- Next.js Route Handlers
- Supabase
- PostgreSQL
- Service layer
- Repository abstractions

### Authentication và security

- NextAuth
- JWT
- `jose`
- bcrypt
- Bảo vệ JWT bằng RSA
- Zod validation

### Hiển thị dữ liệu và UI

- Recharts
- TanStack Table
- Radix UI
- Tailwind CSS

### Công cụ phát triển

- ESLint
- Prettier
- TypeScript
- pnpm
- Next.js Bundle Analyzer

------------------------------------------------------------------------

## Cấu trúc source code chi tiết

``` text
src/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── cabins/
│   │   ├── downloads/
│   │   └── session/
│   ├── guest/
│   │   ├── account/
│   │   ├── cabins/
│   │   ├── login/
│   │   └── setup-new-guest/
│   └── staff/
│       ├── bookings/
│       ├── cabins/
│       ├── dashboard/
│       ├── profile/
│       ├── settings/
│       └── user/
│
├── features/
│   ├── auth/
│   ├── guest/
│   │   ├── account/
│   │   ├── cabins/
│   │   └── login/
│   └── staff/
│       ├── bookings/
│       ├── cabins/
│       ├── dashboard/
│       ├── profile/
│       ├── settings/
│       └── user/
│
├── repositories/
│   ├── FileRepository.ts
│   ├── RefreshTokenRepository.ts
│   └── Repository.ts
│
├── services/
│   ├── BookingService.ts
│   ├── CabinService.ts
│   ├── FileService.ts
│   ├── GuestService.ts
│   ├── SettingService.ts
│   └── StaffService.ts
│
└── shared/
    ├── components/
    ├── hooks/
    ├── providers/
    ├── schemas/
    ├── store/
    ├── types/
    └── utils/
```

------------------------------------------------------------------------

## Quy trình đặt chỗ

Luồng đặt chỗ được phân chia giữa trải nghiệm của khách và các thao tác
quản lý của nhân viên.

Luồng cơ bản dành cho khách:

``` text
Xem danh sách cabin
        ↓
Xem chi tiết cabin
        ↓
Chọn ngày
        ↓
Nhập thông tin đặt chỗ
        ↓
Kiểm tra dữ liệu
        ↓
Tạo đặt chỗ
        ↓
Xem thông tin đặt chỗ
```

Sau đó, nhân viên có thể xử lý đặt chỗ trong khu vực quản lý:

``` text
Danh sách đặt chỗ
        ↓
Chi tiết đặt chỗ
        ↓
Check-in
        ↓
Khách lưu trú
        ↓
Check-out
```

Nhờ tách riêng hai luồng, giao diện khách tập trung vào trải nghiệm đặt
chỗ, còn giao diện nhân viên tập trung vào công việc vận hành.

------------------------------------------------------------------------

## Staff Dashboard

Dashboard dành cho nhân viên cung cấp cái nhìn tổng quan về hoạt động
đặt chỗ, bao gồm:

- Thống kê đặt chỗ
- Các số liệu liên quan đến doanh thu
- Biểu đồ doanh thu
- Phân tích thời gian lưu trú
- Hoạt động check-in/check-out trong ngày
- Làm mới dữ liệu

Các component của dashboard nằm trong:

``` text
features/staff/dashboard/
```

------------------------------------------------------------------------

## API

Ứng dụng sử dụng Next.js Route Handlers cho một số thao tác phía server.

``` text
/api/auth
/api/cabins/[cabinId]
/api/downloads/bookings
/api/downloads/cabins
/api/session/guest
/api/session/staff
```

API layer được tách khỏi application services để tránh gắn chặt việc xử
lý HTTP request với business logic.

------------------------------------------------------------------------

## Giao diện và trải nghiệm người dùng

Cả khu vực khách và nhân viên đều có layout responsive.

Một số phần được chú ý trong quá trình xây dựng:

- Loading state
- Skeleton component
- Error boundary
- Trang not-found
- Chuyển cảnh bằng animation
- Toast notification
- Phản hồi khi nhập form
- Responsive navigation
- Dark mode
- Tương tác với bảng dữ liệu

Framer Motion được dùng cho các chuyển cảnh và phản hồi trực quan khi
cần thiết, thay vì thay thế các tương tác CSS thông thường.

------------------------------------------------------------------------

## Các nguyên tắc phát triển

### SOLID

Code được tổ chức nhằm phân chia trách nhiệm và quản lý dependency rõ
ràng, đặc biệt ở các phần service, repository, authentication và feature
modules.

### Immutability

Ưu tiên xử lý dữ liệu theo hướng immutable khi phù hợp, giúp các thay
đổi state và hành vi của application dễ theo dõi hơn.

### Composition over inheritance

Ưu tiên kết hợp các component và service nhỏ thay vì xây dựng hệ thống
kế thừa nhiều tầng.

### Separation of concerns

UI rendering, application logic, data access, validation và shared
infrastructure được tách riêng ở những nơi phù hợp.

------------------------------------------------------------------------

## Cài đặt và chạy project

### Yêu cầu

- Node.js
- pnpm
- Một Supabase project

### Clone repository

``` bash
git clone https://github.com/TriDecent/breezy-haven.git

cd breezy-haven
```

### Cài đặt dependencies

``` bash
pnpm install
```

### Cấu hình biến môi trường

Tạo file `.env` và điền các biến môi trường cần thiết cho Supabase
và authentication.

Tên biến cụ thể phụ thuộc vào cấu hình đang được sử dụng trong project.
Ví dụ:

``` env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Không commit secret hoặc thông tin đăng nhập production lên repository.

### Chạy môi trường development

``` bash
pnpm dev
```

Mở `http://localhost:3000` trên trình duyệt.

### Build và chạy production

``` bash
pnpm build
pnpm start
```

------------------------------------------------------------------------

## Các lệnh có sẵn

| Lệnh           | Mô tả                                      |
|----------------|------------------------------------------- |
| `pnpm dev`     | Chạy development server với Turbopack      |
| `pnpm build`   | Build application cho production           |
| `pnpm start`   | Chạy production server                     |
| `pnpm lint`    | Chạy ESLint                                |
| `pnpm prod`    | Build rồi khởi chạy application            |
| `pnpm analyze` | Phân tích production bundle của Next.js    |

------------------------------------------------------------------------

## Phạm vi project

The Breezy Haven là một portfolio project nhằm thể hiện kinh nghiệm thực
hành với full-stack development và các nguyên tắc software engineering.

Project không nhằm thay thế một hệ thống quản lý khách sạn thương mại
với đầy đủ yêu cầu vận hành thực tế.

Phần trọng tâm của project gồm:

- Phát triển full-stack application
- Authentication và authorization
- Quy trình đặt chỗ
- Tổ chức kiến trúc ứng dụng
- Quản lý dữ liệu
- Kiểm tra dữ liệu form
- State management
- UI component có thể tái sử dụng
- TypeScript code dễ bảo trì

------------------------------------------------------------------------

## License

MIT License.
