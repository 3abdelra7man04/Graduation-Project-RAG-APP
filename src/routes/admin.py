from fastapi import APIRouter, Body, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse
from models.AdminModel import AdminModel
from models.ProjectModel import ProjectModel
from models.db_schemes.admin import Admin
from .schemes.admin import AdminInviteRequest
from models.enums.ResponseEnums import ResponseSignal
from bson.objectid import ObjectId
from models.enums.AdminStatusEnum import AdminStatusEnum

# User API router
admin_router = APIRouter(
    prefix="/api/v1/admin",
    tags=["api_v1", "admin"],
)

# register route
@admin_router.post("/invite/{project_id}")
async def invite_admin(request: Request, project_id: str, AdminInviteRequest: AdminInviteRequest):

    # retrieve db_client
    db_client = request.app.db_client

    project_model = await ProjectModel.create_instance(db_client=db_client)
    project = await project_model.get_project_or_create_one(project_id=project_id)
    

    # create admin object
    admin = Admin(
        admin_project_id=ObjectId(project_id),
        admin_name = AdminInviteRequest.admin_name,
        admin_email= AdminInviteRequest.admin_email,
        admin_password= 12345678,
        admin_role= AdminInviteRequest.admin_role,
        admin_status= AdminStatusEnum.INACTIVE.value
    )

    # user model instance
    admin_model = await AdminModel.create_instance(db_client= db_client)

    existing_user = await admin_model.create_admin(admin= admin)

    # # if email is already there
    if not existing_user:
        return JSONResponse(
            status_code = status.HTTP_409_CONFLICT,
            content = {"signal": ResponseSignal.EMAIL_EXISTS.value}
        )
    
    return JSONResponse(
            content = {"signal": ResponseSignal.ADMIN_REGISTER_SUCCESS.value,
                       "user_id": str(admin.id)}
        )

# login route
@admin_router.post("/login/{project_id}")
async def login(request: Request, project_id: str, credentials: dict = Body(...)):

    # retrieve db_client
    db_client = request.app.db_client

    project_model = await ProjectModel.create_instance(db_client=db_client)
    project = await project_model.get_project_or_create_one(project_id=project_id)

    # user model instance
    admin_model = await AdminModel.create_instance(db_client= db_client)

    # get user by email
    admin = await admin_model.get_admin_by_email(credentials["email"])

    # user found
    if admin and admin.admin_password == credentials["password"]:
        return JSONResponse(
            content = {"signal": ResponseSignal.LOGIN_SUCCESS.value,
                       "admin_id": str(admin.id)}
        )
    
    return JSONResponse(
            status_code = status.HTTP_401_UNAUTHORIZED,
            content = {"signal": ResponseSignal.LOGIN_FAILED.value}
        )

# get profile route
@admin_router.get("/get-profile/{project_id}")
async def get_profile(request: Request, project_id: str, admin_id: str):

    # retrieve db_client
    db_client = request.app.db_client

    project_model = await ProjectModel.create_instance(db_client=db_client)
    project = await project_model.get_project_or_create_one(project_id=project_id)

    # user model instance
    admin_model = await AdminModel.create_instance(db_client= db_client)

    # get user by email
    admin = await admin_model.get_admin_by_id(id = admin_id)

    # convert id from ObjectId to normal string 
    admin.id = str(admin.id)
    admin.admin_project_id = str(admin.admin_project_id)
    admin.admin_last_login = str(admin.admin_last_login)

    # user not found
    if not admin:
        return JSONResponse(
            status_code = status.HTTP_404_NOT_FOUND,
            content = {"signal": ResponseSignal.PROFILE_NOT_FOUND.value}
        )
    
    return JSONResponse(
            content = {"signal": ResponseSignal.PROFILE_FOUND.value,
                       "adminData": admin.model_dump()}
        )

@admin_router.get("/{project_id}/list")
async def list_admins(request: Request, project_id: str):
    
     # get projects collection or create it
    db_client = request.app.db_client  # get the db_client

    project_model = await ProjectModel.create_instance(
        db_client=db_client
    )  # create the ProjectModel instance

    project = await project_model.get_project_or_create_one(project_id=project_id)

    # project not found
    if not project:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"signal": ResponseSignal.PROJECT_NOT_FOUND.value},
            )
    
    # admin model instance
    admin_model = await AdminModel.create_instance(db_client)

    # get all admins
    all_admins = await admin_model.list_all_admins(project_id= ObjectId(project.id))
    
    for admin in all_admins:
        admin["_id"] = str(admin["_id"])
        admin["admin_project_id"] = str(admin["admin_project_id"])
        admin["admin_last_login"] = str(admin["admin_last_login"])

    # return response
    if not all_admins:
        return JSONResponse(
            status_code= status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.LIST_ADMINS_ERROR.value}
        )
    
    return JSONResponse(
        status_code= status.HTTP_200_OK,
        content={"signal": ResponseSignal.LIST_ADMINS_SUCCESS.value,
                 "all_admins": all_admins}
    )
