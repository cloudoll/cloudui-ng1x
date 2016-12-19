<div class="box" id="add_view" >
	<div class="box-header with-border">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		<h4 class="box-title" id="myModalLabel">创建</h4>
	</div>
	<div class="box-body">
		<form class="form-horizontal">
			<div class="row">
				<div class="form-group">
					<label class="col-xs-3 control-label">名称：</label>
					<div class="col-xs-7">
						<input type="text" name="name" value="<%= name %>" class="form-control" placeholder="">
					</div>
				</div>
				<div class="form-group">
					<label class="col-xs-3 control-label">版本：</label>
					<div class="col-xs-7">
						<input type="text" name="version" value="<%= version %>" class="form-control" placeholder="">
					</div>
				</div>
				<div class="form-group">
					<label class="col-xs-3 control-label">说明：</label>
					<div class="col-xs-7">
						<textarea style="resize:none;" name="intro" class="form-control" rows="3"></textarea>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div class="box-footer ">
		<div class="col-xs-offset-4 col-xs-2">
			<button type="button " class="btn btn-primary btn-block btn-done" >提交</button>
		</div>
        <div class=" col-xs-2">
            <button type="button " class="btn btn-default btn-block btn-cancel"  class="close" data-dismiss="modal" >取消</button>
        </div>
	</div>
</div>