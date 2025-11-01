// models/User.js

import mongoose from "mongoose";

const postModelRef = "Post";

// Define the arrays at the top of your model file
const AVATAR_LIST = [
  "https://scontent.cdninstagram.com/v/t51.82787-15/569045811_17880441420410848_3439104141522070258_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzc0OTEzNzQ2NzQ3NjI4MjMxMg%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=WjsL8p5G83oQ7kNvwFarR_z&_nc_oc=AdndkZ1UbOkN_76Qetes26I7AowM5OAm_hR34U1Yqw7Coom2KXPpMUM0Om9WJQTHddXgZWWOTsNBSo79me4MxGZh&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=5nlfDpuXvSECfOLnXm7xFg&oh=00_AfeXXpw0LFrilucz9hUB8ADKz3scMJRet5Ukoy0Gy05WGQ&oe=690B5322",
  "https://scontent.cdninstagram.com/v/t51.82787-15/536252421_17923411632151067_4595395984567254601_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=103&ig_cache_key=MzcwNDEwMTQ5OTA3MjY2MjYwMA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MjU0NS5zZHIuQzMifQ%3D%3D&_nc_ohc=81w_GyvyuEAQ7kNvwHUOUP2&_nc_oc=Adm7zn6Jd5bGXMr-k-Grpp5JPzEjP-cns8qWmnJ8BNsj41d6zgc-sBcNmMvpdIW2avIQ25gWNpphE-rUunCX7iwR&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=wLNlnfZZ9tFA53JsVQfS1A&oh=00_AfcjG_VTP1-SJ1w1kFD56ocP_hhx_yi78vxNmxONoKR-KA&oe=690B574F",
  "https://scontent.cdninstagram.com/v/t51.82787-15/531402060_17871628368410848_5145718248121667588_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzY5NjI0NTY3NjYzMTExMzk1MQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=zdPn0a9bskMQ7kNvwEWQW7U&_nc_oc=AdmlOvk5mdK3GCeWSyIogs6APfUNFA-1NeY9zFNu9xYblDSFWV7vDR1zyQhKFnMn4dYXUKRzbGSubVl-mUJl9eY-&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=a5rPcjCAa73j15AK2W1Mkw&oh=00_AfctNBCs-XQtNkjOLKSfe_tWpe9zY-KxwyYGhmnMGyohFw&oe=690B4145",
  "https://scontent.cdninstagram.com/v/t51.82787-15/529687685_17871628410410848_5240440417186572414_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzY5NjI0NTg2MzgzMTA2ODQ4MQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=ych7BLR85CAQ7kNvwGu07oy&_nc_oc=Adk3h3PpIyH6rZwjoFPytykaRwD4YLrUlMCt-id7IHqCAN2PlR_pweDY_VqkNms9MBmHub13DUKYjZDGZqT7v-NQ&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=a5rPcjCAa73j15AK2W1Mkw&oh=00_AffLEUe-_mGIJ2Yrgeb2eTbFF8LPyi3UgO5_V1vcri61xA&oe=690B613E",

  "https://scontent.cdninstagram.com/v/t51.82787-15/568666901_17880490233410848_2448972417112484952_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzc0OTQ4NDg5NzE0NTQ3OTU1MA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=-IxmIVfs9P4Q7kNvwEzb8px&_nc_oc=AdnQEe2gkuwhBeR5e3Zx8ir6bZHfsMB_lHfhfWHkIUYBYgqAXTZ4fzwBSPHuxKU1ew7xzoJ029Qb2v2rVCRL1KgF&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&se=7&_nc_ht=scontent.cdninstagram.com&_nc_gid=Ry8XUjUVzCjjH-SDTAvJxw&oh=00_AfdXIXzoknwyLjfccpuPhRHoxLddWPMRuhSYnPrDeiTDMA&oe=690B5A0A",
  "https://scontent.cdninstagram.com/v/t51.82787-15/560202211_17878591665410848_4742705340051212925_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=MzczNzE4NjU2NDYxMTg0NjExOQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=TGwVLSI6TQYQ7kNvwFS0DMw&_nc_oc=Adkgs7g60D0HPbaMkxX5p-fhbnPyVYHdGrUHMJScZxV8Jp4iWPScoUuRSUJgk3sKjs0Yfrg0_4Yw_XRG1CN7vQ8U&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=WJjlk8JBNaQ0JG2nlwtvCQ&oh=00_Afe4WRiz_hEPuNGKfZkDqtTDBXlKofElUinmWkkFWVTZhg&oe=690B5B1D",
  "https://scontent.cdninstagram.com/v/t51.82787-15/548000087_17875817964410848_4596671231056590423_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzcyMDE1NTc5OTQ5NTQzODMwMw%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=ary3Vl3LlHcQ7kNvwETQayk&_nc_oc=AdmOxQTGOVok-R7mb09U4WM7EVT0-egus5MThla2fQQB6T4oOH9N-WhsF3wwt2oMKopxa5UyAFsRAtzKsi7gIpNH&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=zSmmhhRab-kApnMNYQX_Jw&oh=00_Afd-Ms7H4E_3iFsHhwnDYAOpDjCp-F2M0_6m4ZMGE7QcUA&oe=690B39A7",
  "https://scontent.cdninstagram.com/v/t51.82787-15/553672062_17877185070410848_4570815341130450844_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzcyODQzNzM3ODYxMzU3NDY1Nw%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=qXGjoJ7Q69oQ7kNvwFqZTNw&_nc_oc=AdlQ1_Aa-1_c0IaORykMva8VHhECO-a-4dVrq_d7Ay25iLYdzHCaJHDUvCbyljaeKqp-MTU-opISVu3qPd10LrbB&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=5tMrozryV2KzVQIR-M_M5w&oh=00_AffzsDkoeOOxqakHx6gnnGk5GNokt7smje43LVnJrkznsw&oe=690B4038",
];

const COVER_LIST = [
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0ce65467-b86d-41bb-9230-5293ef682778/dkj37cd-6f1594e6-6b60-4cfe-a936-4b812aa1bd2d.png/v1/fill/w_1192,h_670,q_70,strp/natural_landscape_by_zeronwo_dkj37cd-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8wY2U2NTQ2Ny1iODZkLTQxYmItOTIzMC01MjkzZWY2ODI3NzgvZGtqMzdjZC02ZjE1OTRlNi02YjYwLTRjZmUtYTkzNi00YjgxMmFhMWJkMmQucG5nIiwiaGVpZ2h0IjoiPD03MjAiLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiIvd20vMGNlNjU0NjctYjg2ZC00MWJiLTkyMzAtNTI5M2VmNjgyNzc4L3plcm9ud28tNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.Nzd3k7cP-tuQNvV5C0Q9UMPxRCz7vFCGuoLidm_3rps",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6341609d-ea22-409c-8843-05e8c0551874/dk8rv0f-6d954210-f525-47d8-98a4-2c9bb8e1d2dd.png/v1/fill/w_1194,h_669,q_70,strp/beautiful_fantasy_nature_background__5___i20_by_pyacademi1998_dk8rv0f-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODE2IiwicGF0aCI6Ii9mLzYzNDE2MDlkLWVhMjItNDA5Yy04ODQzLTA1ZThjMDU1MTg3NC9kazhydjBmLTZkOTU0MjEwLWY1MjUtNDdkOC05OGE0LTJjOWJiOGUxZDJkZC5wbmciLCJ3aWR0aCI6Ijw9MTQ1NiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.koEMJP--kVTszJjPL2pTGaaZW1be2s_MnjZ1hlp_aXI",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6341609d-ea22-409c-8843-05e8c0551874/dk7uiaf-415d344d-581e-45c6-b382-69a2e3064755.png/v1/fill/w_1194,h_669,q_70,strp/beautiful_fantasy_nature_background__3___i18_by_pyacademi1998_dk7uiaf-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODE2IiwicGF0aCI6Ii9mLzYzNDE2MDlkLWVhMjItNDA5Yy04ODQzLTA1ZThjMDU1MTg3NC9kazd1aWFmLTQxNWQzNDRkLTU4MWUtNDVjNi1iMzgyLTY5YTJlMzA2NDc1NS5wbmciLCJ3aWR0aCI6Ijw9MTQ1NiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.Y3i-M-CTcnGlAVu7Rkk0opci8nLxm1Bgq84z-KXzb40",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d1b51f5e-5c08-4dee-ba8f-3e5b0930796f/dkmmnzb-5722beb0-85ed-4bc8-bbdc-4ea7247e213b.jpg/v1/fill/w_1382,h_578,q_70,strp/blue_gas_giant_by_grahamtg_dkmmnzb-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQ0MCIsInBhdGgiOiIvZi9kMWI1MWY1ZS01YzA4LTRkZWUtYmE4Zi0zZTViMDkzMDc5NmYvZGttbW56Yi01NzIyYmViMC04NWVkLTRiYzgtYmJkYy00ZWE3MjQ3ZTIxM2IuanBnIiwid2lkdGgiOiI8PTM0NDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.TpMdwMA8zvETUCseggF17vIfdOM3bRdIZ5BvX7LDYGM",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/087edc4e-484d-4cd3-97e0-fd4c287c82a0/dkicwzk-3eea1284-7e31-47be-b747-69a95ecd0995.jpg/v1/fill/w_1006,h_631,q_75,strp/sharkstone_by_viceberly_dkicwzk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjMxIiwicGF0aCI6Ii9mLzA4N2VkYzRlLTQ4NGQtNGNkMy05N2UwLWZkNGMyODdjODJhMC9ka2ljd3prLTNlZWExMjg0LTdlMzEtNDdiZS1iNzQ3LTY5YTk1ZWNkMDk5NS5qcGciLCJ3aWR0aCI6Ijw9MTAwNiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.9SGktblLhZDL0pgyq5N2rQxc84fijwUSFSYuX7uSTSY",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4c11a202-8870-440c-bfa9-025aa7222694/dic6o40-c8e6eb23-e051-4463-abd2-d096722f90aa.jpg/v1/fill/w_1194,h_669,q_70,strp/celestial_symphony_by_kareguya_dic6o40-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzE4IiwicGF0aCI6Ii9mLzRjMTFhMjAyLTg4NzAtNDQwYy1iZmE5LTAyNWFhNzIyMjY5NC9kaWM2bzQwLWM4ZTZlYjIzLWUwNTEtNDQ2My1hYmQyLWQwOTY3MjJmOTBhYS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.V0jFuEOxzXSIh-oQ88Q8GOXfbEv9jvmIkAZF2POV-GQ",
];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: {
      type: String,
      default: "Welcome to my ByteList profile!",
      maxLength: [150, "Bio cannot be more than 150 characters."],
    },
    avatar: {
      type: String,
      default: function () {
        return AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)];
      },
    },
    coverPhoto: {
      type: String,
      default: function () {
        return COVER_LIST[Math.floor(Math.random() * COVER_LIST.length)];
      },
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    stats: {
      posts: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      saved: {
        type: Number,
        default: 0,
      },
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: postModelRef,
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepoPost",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: postModelRef,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
