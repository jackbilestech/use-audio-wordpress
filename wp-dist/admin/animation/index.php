<?php
   return  '
   <div class="container">
        <div class="row" id="saved_files">
            
        </div>
        <form method="post" action="/animations" enctype="multipart/form-data">
            <div class="row">
                <div class="col">
                    Animation Script To Upload
                </div>
                <div class="col">
                    <input type="file" id="file" name="animation_file">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    ID
                </div>
                <div class="col">
                    <input type="text" id="animation_file_id" name="animation_file_id">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <input type="submit" value="Upload Animation Script" class="btn btn-primary">
                </div>
            </div>
        </form>
   </div>
   ';

