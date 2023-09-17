import Image from 'next/image'
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabaseClient'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useRouter } from 'next/router'

type Link = {
  title: string;
  url: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>();
  const [images, setImages] = useState<ImageListType>([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>();
  
  const router = useRouter();
  const {creatorSlug} = router.query;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  // Authenticate user login
  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user: ", user);
      if (user.data.user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        console.log("authenticated: ", isAuthenticated);
        setUserId(userId);
      }
    };

    getUser();
  }, []);

  // Get links of user
  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error} = await supabase.from("links")
          .select("title, url")
          .eq("user_id", userId);

        if (error) {
          throw error;
        }
        setLinks(data);
        console.log("data: ", data);
      }
      catch (error) {
        console.log("error", error);
      }
    }
    if (userId) {
      getLinks();
    }
  }, [userId]);

  // Get profile picture of user
  useEffect(() => {
    const getPfp = async () => {
      try {
        console.log("getting pfp")
        
        const { data, error} = await supabase.from("users")
          .select("id, profile_picture_url")
          .eq("username", creatorSlug);

        if (error) {
          throw error;
        }
        const profilePictureUrl = data[0]["profile_picture_url"]
        setProfilePictureUrl(profilePictureUrl)

        const userId = data[0]["id"]
        setUserId(userId)
        console.log("data: ", data);
        
      }
      catch (error) {
        console.log("error", error);
      }
      
    }
    if (creatorSlug) {
      getPfp();
    }
  }, [creatorSlug]);


  // Adds new link to database when Add button is clicked
  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error} = await supabase.from("links").insert({
          title: title,
          url: url,
          user_id: userId,
        }).select();
        if (error) throw error;
        console.log("data: ", data);
        if (links) {
          setLinks([...data, ...links]);
        }
      }
    }
    catch (error) {
      console.log("error: ", error);
    }
  }

  // Store profile picture to storage
  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0];
        if (image.file && userId) {
          const {data, error} = await supabase.storage.from("public_bucket")
            .upload(`${userId}/${image.file.name}`, image.file, {upsert: true})
          if (error) throw error;
          const resp = supabase.storage.from("public_bucket").getPublicUrl(data.path)
          const publicUrl = resp.data.publicUrl;
          const updateUserResponse = await supabase.from("users")
            .update({profile_picture_url: publicUrl})
            .eq("id", userId);
          if (updateUserResponse.error) throw error;
        }
      }
    }
    catch (error) {
      console.log("error: ", error)
    }
    
  }

  return (
    <div className="flex flex-col w-full items-center justify-between mt-20">
      {profilePictureUrl && <Image src = {profilePictureUrl}
      alt = "profile-picture"
      height = {150} 
      width = {150} 
      className='rounded-full w-150 h-150'
      />}
      <h1 className = 'mt-2 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-3xl dark:text-white'>@{creatorSlug}</h1>
      <div className='mt-16'>
        {links?.map((link:Link, index: number) => (
          
          <div 
          className='shadow-xl w-96 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
          key = {index}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = link.url;
          }}
          >
          <span className="w-96 flex flex-col text-lg items-center items-center justify-center relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-800 text-white rounded-full group-hover:bg-opacity-0">{link.title}</span> 
          </div>
        ))}
      </div>
      
      
      {isAuthenticated && (
        <>
          <div className='flex flex-col w-full items-center justify-between mt-20'>
            <h1 className='text-md font-bold leading-none tracking-tight text-gray-900 md:text-xl  dark:text-white'>
              Add Links
            </h1>
            <div className="">
              <div className='block text-sm font-medium text-white-700 dark:text-white'>Title</div>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="title" 
                name = "title"
                type="text" 
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mt-4">
              <div className='block text-sm font-medium text-white-700 dark:text-white'>URL</div>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="url" 
                name = "url"
                type="text" 
                placeholder="www.link.com"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
                className="hover:bg-[#006363] bg-[#008080]/100 font-bold text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-4" 
                type="button"
                onClick = {addNewLink}
                >
                Add Link
            </button>
          </div>
          <div className='flex flex-col w-full items-center justify-between mt-8'>
            <h1 className='text-md font-bold leading-none tracking-tight text-gray-900 md:text-xl  dark:text-white mb-2'>
              Change Profile Picture
            </h1>
    
            {images && images.length > 0 ? (
              <Image
                src={images[0]["data_url"]}
                height={100}
                width={100}
                alt="profile-picture"
              />
            ) : (
              // You can display a placeholder or a message here when no image is available.
              <p></p>
            )}
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper bg-transparent hover:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">
                  <button
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Click or Drop here
                  </button>
                  &nbsp;
                  {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      {/* <img src={image['data_url']} alt="" width="100" /> */}
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>Update</button>
                        <button onClick={() => onImageRemove(index)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
            <button 
              className="hover:bg-[#006363] bg-[#008080]/100 font-bold text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-4" 
              type="button"
              onClick = {() => uploadProfilePicture()}
              >
              Upload profile picture
            </button>
          </div>
        </>
      )}
    </div>      
  )
}
