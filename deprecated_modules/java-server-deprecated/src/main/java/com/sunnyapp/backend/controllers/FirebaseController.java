package com.sunnyapp.backend.controllers;


import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.Query;
import com.sunnyapp.backend.utils.FirebaseUtil;
import com.sunnyapp.backend.services.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "api/posts/")
public class FirebaseController {

    private PostsService postsService;

    @Autowired
    public void setPostsService(PostsService postsService) {
        this.postsService = postsService;
    }

   /* @RequestMapping(value = "/products", method = RequestMethod.GET)
    public String list(Model model){
        model.addAttribute("products", productService.listAllProducts());
        System.out.println("Returning rpoducts:");
        return "products".;
    }*/

    @RequestMapping("delete/daily")
    public @ResponseBody String deletePosts(){
        postsService.startDeletePostsService();
        //deleteHelper();
        //model.addAttribute("product", productService.getProductById(id));
        return "index";
    }



    private void deleteHelper(){
        Query query = FirebaseUtil.getPostsRef().orderByChild("text").equalTo("TestPost");
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                int a = 6;
                dataSnapshot.getRef().removeValue();
                //((HashMap)dataSnapshot.getValue()).get("text");
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                int a = 6;
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
    }

   /* private void deleteUsersHelper(){
        FirebaseAuth.getInstance().
        Query query = FirebaseUtil.getUsersRef();
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                dataSnapshot.getChildrenCount();
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                dataSnapshot.getChildrenCount();
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {
                dataSnapshot.getChildrenCount();
            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
                dataSnapshot.getChildrenCount();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                databaseError.toString();
            }
        });

    }*/


}
